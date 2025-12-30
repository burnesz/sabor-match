import os
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "uploads/receitas"

os.makedirs(UPLOAD_DIR, exist_ok=True)

def salvar_imagem(imagem: UploadFile) -> str:
    ext = imagem.filename.split(".")[-1]
    nome_arquivo = f"{uuid.uuid4()}.{ext}"
    caminho = os.path.join(UPLOAD_DIR, nome_arquivo)

    with open(caminho, "wb") as f:
        f.write(imagem.file.read())

    return caminho

def deletar_imagem(path: str):
    if os.path.exists(path):
        os.remove(path)