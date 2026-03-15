from app.utils.utils import _formatar_receita
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from app.models.categoria import Categoria
from app.models.receita import Receita
from app.models.associacoes import ReceitaFavorita
from app.models.user import User
from ..schemas.receita import ReceitaCreate, ReceitaResponse, BuscaPaginada
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
    return db.query(Categoria).all()

@router.post("/nova-receita", status_code=201)
def criar_receita(receita: ReceitaCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_receita = create_receita(db=db, receita=receita, usuario_id=current_user.id)
    if not db_receita:
        deletar_imagem(receita.imagem_path)
        raise HTTPException(status_code=500, detail="Erro ao criar a receita")
    return db_receita

@router.get("/minhas-receitas/carrossel", response_model=List[ReceitaResponse], status_code=200)
def listar_receitas_carrossel(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    receitas = get_receitas_recentes_usuario(db=db, usuario_id=current_user.id, limite=10)
    return [_formatar_receita(r) for r in receitas]

@router.get("/recentes", response_model=List[ReceitaResponse], status_code=200)
def listar_receitas_recentes_globais(db: Session = Depends(get_db)):
    receitas = get_receitas_recentes_globais(db=db, limite=10)
    return [_formatar_receita(r) for r in receitas]
 
@router.get("/recomendadas", response_model=List[ReceitaResponse], status_code=200)
def listar_receitas_recomendadas(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    receitas = get_recomendacoes_por_categoria_usuario(db=db, usuario_id=current_user.id, limite=10)
    return [_formatar_receita(r) for r in receitas]

@router.get("/receitas-favoritas", response_model=List[ReceitaResponse], status_code=200)
def listar_receitas_favoritas(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    receitas = get_receitas_favoritas_usuario(db=db, usuario_id=current_user.id, limite=10)
    return [_formatar_receita(r) for r in receitas]

@router.post("/{receita_id}/favoritar", status_code=201)
def favoritar_receita(receita_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(ReceitaFavorita).filter(
        ReceitaFavorita.usuario_id == current_user.id, ReceitaFavorita.receita_id == receita_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Receita já favoritada")
    
    db.add(ReceitaFavorita(usuario_id=current_user.id, receita_id=receita_id))
    db.commit()
    return {"message": "Receita favoritada"}

@router.delete("/{receita_id}/favoritar", status_code=204)
def desfavoritar_receita(receita_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    favorita = db.query(ReceitaFavorita).filter(
        ReceitaFavorita.usuario_id == current_user.id, ReceitaFavorita.receita_id == receita_id
    ).first()
    if not favorita:
        raise HTTPException(status_code=404, detail="Receita não está favoritada")
    
    db.delete(favorita)
    db.commit()

@router.get("/{receita_id}", response_model=ReceitaResponse)
def obter_receita(receita_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    receita = db.query(Receita).filter(Receita.id == receita_id).first()
    if not receita:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return _formatar_receita(receita).model_dump()

@router.get("/{receita_id}/favoritada")
def verificar_favorita(receita_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    favorita = db.query(ReceitaFavorita).filter(
        ReceitaFavorita.usuario_id == current_user.id, ReceitaFavorita.receita_id == receita_id
    ).first()
    return {"favoritada": favorita is not None}

@router.get("/buscar/resultado", response_model=BuscaPaginada, status_code=200)
def buscar_receitas_endpoint(q: str, pagina: int = 1, tamanho_pagina: int = 10, db: Session = Depends(get_db)):
    if not q or len(q.strip()) < 2:
        raise HTTPException(status_code=400, detail="Termo de busca deve ter pelo menos 2 caracteres")

    pagina = max(1, pagina)
    tamanho_pagina = max(1, min(100, tamanho_pagina))

    db_receitas, total_itens = buscar_receitas(db=db, termo=q, pagina=pagina, tamanho_pagina=tamanho_pagina)
    total_paginas = (total_itens + tamanho_pagina - 1) // tamanho_pagina
    
    receitas = [_formatar_receita(r) for r in db_receitas]

    return BuscaPaginada(
        items=receitas,
        total_itens=total_itens,
        total_paginas=total_paginas,
        pagina_atual=pagina,
        tamanho_pagina=tamanho_pagina
    )