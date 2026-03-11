from sqlalchemy.orm import Session, selectinload
from sqlalchemy import exists, and_, or_
from app.models.receita import Receita
from app.models.ingrediente import Ingrediente
from app.models.associacoes import ReceitaCategoria, ReceitaIngrediente, ReceitaFavorita
from app.models.categoria import Categoria
from app.models.user import User
from app.schemas.receita import ReceitaCreate
from app.utils.utils import tratar_string
from rapidfuzz import fuzz

def create_receita(db: Session, receita: ReceitaCreate, usuario_id: int):
    try:
        db_receita = Receita(
            usuario_id=usuario_id,
            titulo=receita.titulo,
            descricao=receita.descricao,
            tempo_minutos=receita.tempo_minutos, 
            porcoes=receita.porcoes,
            imagem_path=receita.imagem_path
        )
        
        db.add(db_receita)
        db.flush() 

        for ing_data in receita.ingredientes:
            nome_normalizado = tratar_string(ing_data.nome)
            
            db_ingrediente = db.query(Ingrediente).filter(Ingrediente.nome == nome_normalizado).first()
            
            if not db_ingrediente:
                db_ingrediente = Ingrediente(nome=nome_normalizado)
                db.add(db_ingrediente)
                db.flush()

            receita_ingrediente_assoc = ReceitaIngrediente(
                receita_id=db_receita.id,
                ingrediente_id=db_ingrediente.id,
                quantidade=ing_data.quantidade,
                unidade=ing_data.unidade
            )
            db.add(receita_ingrediente_assoc)

        for categoria_id in receita.categoria:
            receita_categoria_assoc = ReceitaCategoria(
                receita_id=db_receita.id,
                categoria_id=categoria_id
            )
            db.add(receita_categoria_assoc)

        db.commit()
        db.refresh(db_receita)
        
        ingredientes = [
            {
                "nome": link.ingrediente.nome,
                "quantidade": link.quantidade,
                "unidade": link.unidade
            }
            for link in db_receita.ingredientes_link
        ]

        categorias = [c.nome for c in db_receita.categorias]

        return {
            "id": db_receita.id,
            "usuario_id": db_receita.usuario_id,
            "titulo": db_receita.titulo,
            "descricao": db_receita.descricao,
            "tempo_minutos": db_receita.tempo_minutos,
            "porcoes": db_receita.porcoes,
            "imagem_path": db_receita.imagem_path,
            "ingredientes": ingredientes,
            "categorias": categorias
        }

    except Exception as e:
        db.rollback()
        raise e
    
def get_receitas_recentes_usuario(db: Session, usuario_id: int, limite: int = 10):
    """
    Busca as receitas mais recentes de um usuário para exibir em destaques/carrossel.
    """
    return (
        db.query(Receita)
        .filter(Receita.usuario_id == usuario_id)
        .order_by(Receita.id.desc()) # Garante que as últimas criadas apareçam primeiro
        .limit(limite)
        .all()
    )

def get_receitas_favoritas_usuario(db: Session, usuario_id: int, limite: int = 10):
    """
    Busca as receitas favoritas de um usuário.
    """
    return (
        db.query(Receita)
        .join(Receita.favoritados)
        .filter(User.id == usuario_id)
        .order_by(Receita.id.desc())
        .limit(limite)
        .all()
    )


def get_receitas_recentes_globais(db: Session, limite: int = 10):
    """
    Busca as últimas receitas adicionadas no sistema, independente do usuário.
    """
    return (
        db.query(Receita)
        .order_by(Receita.id.desc())
        .limit(limite)
        .all()
    )

def get_recomendacoes_por_categoria_usuario(db: Session, usuario_id: int, limite: int = 10):
    """
    Busca receitas recomendadas ao usuário com base nas categorias de suas
    receitas favoritas. Se não houver favoritos, mostra receitas recentes de outros usuários.
    """

    # 1. Coletar IDs únicos de categorias de receitas favoritas
    cat_ids = (
        db.query(ReceitaCategoria.categoria_id)
        .join(Receita, Receita.id == ReceitaCategoria.receita_id)
        .join(ReceitaFavorita, ReceitaFavorita.receita_id == Receita.id)
        .filter(ReceitaFavorita.usuario_id == usuario_id)
        .distinct()
        .all()
    )
    cat_ids = [cid for (cid,) in cat_ids]

    # 2. Estratégia Alternativa (Cold Start)
    if not cat_ids:
        return (
            db.query(Receita)
            .filter(Receita.usuario_id != usuario_id)
            .order_by(Receita.id.desc())
            .limit(limite)
            .all()
        )

    # 3. Query principal de Recomendação

    # Subquery com EXISTS (Mais performático que NOT IN)
    stmt_ja_favoritou = exists().where(
        and_(
            ReceitaFavorita.receita_id == Receita.id,
            ReceitaFavorita.usuario_id == usuario_id
        )
    )

    query = (
        db.query(Receita)
        .join(Receita.categorias)
        .filter(Categoria.id.in_(cat_ids))
        .filter(~stmt_ja_favoritou)
        .filter(Receita.usuario_id != usuario_id)
        .distinct()
        .order_by(Receita.id.desc())
        .limit(limite)
    )

    return query.all()

def buscar_receitas(db: Session, termo: str, pagina: int = 1, tamanho_pagina: int = 10):
    """
    Busca receitas com paginação, tolerância a erros de digitação controlada
    e otimização de queries para evitar o problema de N+1.
    """
    if pagina < 1:
        pagina = 1

    skip = (pagina - 1) * tamanho_pagina
    termo_busca = f"%{termo}%"
    termo_lower = termo.lower()

    # Query base otimizada com Eager Loading (Resolve o N+1)
    query_base = (
        db.query(Receita)
        .options(
            selectinload(Receita.categorias),
            selectinload(Receita.ingredientes_link).selectinload(ReceitaIngrediente.ingrediente)
        )
    )

    # FASE 1: Busca exata/parcial nativa no banco de dados (Mais rápida)
    resultado_exato = (
        query_base
        .filter(
            or_(
                Receita.titulo.ilike(termo_busca),
                Receita.descricao.ilike(termo_busca),
                Receita.categorias.any(Categoria.nome.ilike(termo_busca)),
                Receita.ingredientes_link.any(
                    ReceitaIngrediente.ingrediente_id.in_(
                        db.query(Ingrediente.id).filter(Ingrediente.nome.ilike(termo_busca))
                    )
                )
            )
        )
        .distinct()
        .all()
    )

    resultados_combinados = resultado_exato

    # FASE 2: Busca Fuzzy (Apenas se o termo for maior ou igual a 3 caracteres para evitar "lixo")
    if len(termo.strip()) >= 3:
        todas_receitas = query_base.all()
        ids_encontrados = {r.id for r in resultado_exato}
        
        # Filtra as receitas que já vieram na busca exata para não reprocessar
        receitas_restantes = [r for r in todas_receitas if r.id not in ids_encontrados]
        
        receitas_scored = []
        NOTA_CORTE = 82  # Threshold mais rigoroso para diminuir a tolerância excessiva

        for receita in receitas_restantes:
            max_score = 0
            
            # Título: Aceita partial_ratio porque costuma ser um texto curto e direto
            if receita.titulo:
                titulo_clean = receita.titulo.lower()
                max_score = max(
                    max_score,
                    fuzz.token_set_ratio(termo_lower, titulo_clean),
                    fuzz.partial_ratio(termo_lower, titulo_clean)
                )

            # Descrição: APENAS token_set_ratio para evitar falsos positivos em textos longos
            if receita.descricao:
                descricao_clean = receita.descricao.lower()
                max_score = max(max_score, fuzz.token_set_ratio(termo_lower, descricao_clean))

            # Categorias: Textos curtos, aceita ambos
            for cat in receita.categorias:
                if cat.nome:
                    cat_nome = cat.nome.lower()
                    max_score = max(
                        max_score, 
                        fuzz.token_set_ratio(termo_lower, cat_nome),
                        fuzz.partial_ratio(termo_lower, cat_nome)
                    )

            # Ingredientes: Textos curtos, aceita ambos
            for ing in receita.ingredientes_link:
                if ing.ingrediente and ing.ingrediente.nome:
                    ing_nome = ing.ingrediente.nome.lower()
                    max_score = max(
                        max_score,
                        fuzz.token_set_ratio(termo_lower, ing_nome),
                        fuzz.partial_ratio(termo_lower, ing_nome)
                    )

            # Se atingiu a nota de corte, entra para a lista de aprovados
            if max_score >= NOTA_CORTE:
                receitas_scored.append((receita, max_score))

        # Ordena os resultados fuzzy do mais relevante para o menos relevante
        receitas_scored.sort(key=lambda x: x[1], reverse=True)
        
        # Junta os exatos com os fuzzy já ordenados
        resultados_combinados.extend([r for r, _ in receitas_scored])

    # Remove possíveis duplicatas garantindo a ordem de relevância (preserva o primeiro que aparecer)
    ids_vistos = set()
    resultados_unicos = []
    for receita in resultados_combinados:
        if receita.id not in ids_vistos:
            ids_vistos.add(receita.id)
            resultados_unicos.append(receita)

    # FASE 3: Aplica a paginação na lista final consolidada
    total_itens = len(resultados_unicos)
    resultado_paginado = resultados_unicos[skip : skip + tamanho_pagina]

    return resultado_paginado, total_itens