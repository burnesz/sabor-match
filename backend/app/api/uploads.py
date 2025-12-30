from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from typing import Optional
import shutil
import os
from ..utils.file_upload import salvar_imagem

router = APIRouter(prefix="/uploads", tags=["Uploads"])

@router.post("/nova-receita-imagem")
def upload_imagem_receita(imagem: UploadFile = File(...) ):
    imagem_path = salvar_imagem(imagem)
    
    if not imagem_path:
        raise HTTPException(status_code=500, detail="Erro ao salvar a imagem")
    
    return {"msg": "Imagem carregada com sucesso!", "imagem_path": imagem_path}