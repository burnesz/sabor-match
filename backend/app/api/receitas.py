import os
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from app.models.categoria import Categoria
from app.models.receita import Receita
from ..schemas.receita import ReceitaCreate, ReceitaResponse
from ..db.session import get_db
from sqlalchemy.orm import Session
from ..services.receita import create_receita, get_receitas_recentes_usuario
from ..utils.file_upload import deletar_imagem
from ..core.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/receitas", tags=["Receitas"])

@router.get("/listar_categorias")
def listar_categorias(db: Session = Depends(get_db)):
    db_categorias = db.query(Categoria).all()
    return db_categorias

@router.post("/nova-receita", response_model=ReceitaResponse, status_code=201)
def criar_receita(receita: ReceitaCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_receita = create_receita(db=db, receita=receita, usuario_id=current_user.id)
    if not db_receita:
        deletar_imagem(receita.imagem_path)
        raise HTTPException(status_code=500, detail="Erro ao criar a receita")
    return db_receita

@router.get("/minhas-receitas/carrossel", response_model=List[ReceitaResponse], status_code=200)
def listar_receitas_carrossel(
    db: Session = Depends(get_db), 
    current_user: str = Depends(get_current_user)
):
    # Fixamos o limite em 10 diretamente no backend
    db_receitas = get_receitas_recentes_usuario(db=db, usuario_id=current_user.id, limite=10)
    
    return db_receitas
