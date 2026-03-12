import os
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from app.models.categoria import Categoria
from app.models.receita import Receita
from app.models.associacoes import ReceitaFavorita
from app.models.user import User
from ..schemas.receita import ReceitaCreate, ReceitaResponse, ReceitaCarrossel, BuscaPaginada
from ..db.session import get_db
from sqlalchemy.orm import Session
from ..services.receita import (
    create_receita,
    get_receitas_recentes_usuario,
    get_receitas_favoritas_usuario,
    get_receitas_recentes_globais,
    get_recomendacoes_por_categoria_usuario,
    buscar_receitas
)
from ..utils.file_upload import deletar_imagem
from ..core.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/receitas", tags=["Receitas"])

@router.get("/listar_categorias")
def listar_categorias(db: Session = Depends(get_db)):
    db_categorias = db.query(Categoria).all()
    return db_categorias

@router.post("/nova-receita", response_model=ReceitaResponse, status_code=201)
def criar_receita(receita: ReceitaCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_receita = create_receita(db=db, receita=receita, usuario_id=current_user.id)
    if not db_receita:
        deletar_imagem(receita.imagem_path)
        raise HTTPException(status_code=500, detail="Erro ao criar a receita")
    return db_receita

@router.get("/minhas-receitas/carrossel", response_model=List[ReceitaCarrossel], status_code=200)
def listar_receitas_carrossel(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Fixamos o limite em 10 diretamente no backend
    db_receitas = get_receitas_recentes_usuario(db=db, usuario_id=current_user.id, limite=10)
    
    return db_receitas

@router.get("/recentes", response_model=List[ReceitaCarrossel], status_code=200)
def listar_receitas_recentes_globais(
    db: Session = Depends(get_db)
):
    db_receitas = get_receitas_recentes_globais(db=db, limite=10)
    return db_receitas

@router.get("/recomendadas", response_model=List[ReceitaCarrossel], status_code=200)
def listar_receitas_recomendadas(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    db_receitas = get_recomendacoes_por_categoria_usuario(db=db, usuario_id=current_user.id, limite=10)
    return db_receitas

@router.get("/receitas-favoritas", response_model=List[ReceitaCarrossel], status_code=200)
def listar_receitas_favoritas(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    db_receitas = get_receitas_favoritas_usuario(db=db, usuario_id=current_user.id, limite=10)
    
    return db_receitas

@router.post("/{receita_id}/favoritar", status_code=201)
def favoritar_receita(receita_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if already favorited
    existing = db.query(ReceitaFavorita).filter(
        ReceitaFavorita.usuario_id == current_user.id,
        ReceitaFavorita.receita_id == receita_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Receita já favoritada")
    
    favorita = ReceitaFavorita(usuario_id=current_user.id, receita_id=receita_id)
    db.add(favorita)
    db.commit()
    return {"message": "Receita favoritada"}

@router.delete("/{receita_id}/favoritar", status_code=204)
def desfavoritar_receita(receita_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    favorita = db.query(ReceitaFavorita).filter(
        ReceitaFavorita.usuario_id == current_user.id,
        ReceitaFavorita.receita_id == receita_id
    ).first()
    if not favorita:
        raise HTTPException(status_code=404, detail="Receita não está favoritada")
    
    db.delete(favorita)
    db.commit()
    return

@router.get("/{receita_id}", response_model=ReceitaResponse)
def obter_receita(receita_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    receita = db.query(Receita).filter(Receita.id == receita_id).first()
    if not receita:
        raise HTTPException(status_code=404, detail="Receita não encontrada")

    # Build ingredients list
    ingredientes = [
        {
            "nome": ri.ingrediente.nome,
            "quantidade": ri.quantidade,
            "unidade": ri.unidade
        }
        for ri in receita.ingredientes_link
    ]

    # Build categorias list (nomes)
    categorias = [cat.nome for cat in receita.categorias]

    # Build usuario data
    usuario_data = {
        "id": receita.user.id,
        "nome": receita.user.nome
    }

    response = ReceitaResponse(
        id=receita.id,
        usuario_id=receita.usuario_id,
        usuario=usuario_data,
        titulo=receita.titulo,
        descricao=receita.descricao,
        tempo_minutos=receita.tempo_minutos,
        porcoes=receita.porcoes,
        imagem_path=receita.imagem_path,
        ingredientes=ingredientes,
        categorias=categorias
    )
    # return dict to avoid any SQLAlchemy objects slipping through
    return response.model_dump()

@router.get("/{receita_id}/favoritada")
def verificar_favorita(receita_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    favorita = db.query(ReceitaFavorita).filter(
        ReceitaFavorita.usuario_id == current_user.id,
        ReceitaFavorita.receita_id == receita_id
    ).first()
    return {"favoritada": favorita is not None}

@router.get("/buscar/resultado", response_model=BuscaPaginada, status_code=200)
def buscar_receitas_endpoint(
    q: str,
    pagina: int = 1,
    tamanho_pagina: int = 10,
    db: Session = Depends(get_db)
):
    if not q or len(q.strip()) < 2:
        raise HTTPException(status_code=400, detail="Termo de busca deve ter pelo menos 2 caracteres")

    if pagina < 1:
        pagina = 1

    if tamanho_pagina < 1 or tamanho_pagina > 100:
        tamanho_pagina = 10

    db_receitas, total_itens = buscar_receitas(db=db, termo=q, pagina=pagina, tamanho_pagina=tamanho_pagina)

    total_paginas = (total_itens + tamanho_pagina - 1) // tamanho_pagina

    return BuscaPaginada(
        items=db_receitas,
        total_itens=total_itens,
        total_paginas=total_paginas,
        pagina_atual=pagina,
        tamanho_pagina=tamanho_pagina
    )

@router.get("/usuario/{usuario_id}/receitas", response_model=List[ReceitaCarrossel], status_code=200)
def listar_receitas_usuario(
    usuario_id: int,
    db: Session = Depends(get_db)
):
    db_receitas = (
        db.query(Receita)
        .filter(Receita.usuario_id == usuario_id)
        .order_by(Receita.id.desc())
        .limit(20)
        .all()
    )
    return db_receitas

@router.get("/usuario/{usuario_id}/perfil")
def obter_perfil_usuario(
    usuario_id: int,
    db: Session = Depends(get_db)
):
    usuario = db.query(User).filter(User.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    receitas = (
        db.query(Receita)
        .filter(Receita.usuario_id == usuario_id)
        .order_by(Receita.id.desc())
        .all()
    )

    return {
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome
        },
        "receitas": receitas,
        "total_receitas": len(receitas)
    }