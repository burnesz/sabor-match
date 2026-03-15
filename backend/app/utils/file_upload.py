import os
import shutil
from typing import Optional
import uuid
from fastapi import UploadFile
from pathlib import Path

# Volta 3 pastas: utils -> app -> backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Junta com a pasta uploads: .../backend/uploads
UPLOAD_DIR = BASE_DIR / "uploads"

# Cria a pasta principal caso não exista
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def salvar_imagem(diretorio: str, imagem: UploadFile, usuario_id: Optional[int] = None) -> str:
    # Pega a extensão da imagem (ex: jpg, png)
    ext = imagem.filename.split(".")[-1]
    
    if usuario_id is not None:
        # Se recebeu o ID, é foto de perfil. Renomeia com o ID do usuário.
        nome_arquivo = f"perfil_{usuario_id}.png"
    else:
        # Se NÃO recebeu o ID, é uma imagem genérica (ex: receita).
        # Gera um UUID único para evitar que fotos com o mesmo nome se sobrescrevam.
        nome_arquivo = f"{uuid.uuid4()}.{ext}"
    
    # Cria a pasta caso ela ainda não exista no sistema
    os.makedirs(os.path.join(UPLOAD_DIR, diretorio), exist_ok=True)
    caminho = os.path.join(UPLOAD_DIR, diretorio, nome_arquivo)

    # Salva o arquivo em disco
    with open(caminho, "wb") as f:
        shutil.copyfileobj(imagem.file, f)

    return nome_arquivo

def deletar_imagem(path: str):
    if os.path.exists(path):
        os.remove(path)