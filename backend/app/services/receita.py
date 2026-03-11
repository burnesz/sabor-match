from sqlalchemy.orm import Session
from sqlalchemy import exists, and_
from app.models.receita import Receita
from app.models.ingrediente import Ingrediente
from app.models.associacoes import ReceitaCategoria, ReceitaIngrediente, ReceitaFavorita
from app.models.categoria import Categoria
from app.models.user import User
from app.schemas.receita import ReceitaCreate
from app.utils.utils import tratar_string

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