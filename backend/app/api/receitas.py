from fastapi import APIRouter, Form, File, UploadFile, HTTPException, Depends
from typing import Optional
import shutil
import os
from ..schemas.receita import ReceitaCreate, ReceitaResponse
from ..db.session import get_db
from sqlalchemy.orm import Session
from ..services.receita import create_receita
from ..utils.file_upload import deletar_imagem

router = APIRouter(prefix="/receitas", tags=["Receitas"])

@router.post("/nova-receita", response_model=ReceitaResponse, status_code=201)
def criar_receita(receita: ReceitaCreate, db: Session = Depends(get_db)):
    db_receita = create_receita(db=db, receita=receita)
    if not db_receita:
        deletar_imagem(receita.imagem_path)
        raise HTTPException(status_code=500, detail="Erro ao criar a receita")
    return db_receita