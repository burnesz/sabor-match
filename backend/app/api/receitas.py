from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from typing import Optional
import shutil
import os

# Configuração simples para salvar imagens localmente (apenas exemplo)
UPLOAD_DIR = "uploads/receitas"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/receitas", tags=["Receitas"])

@router.post("/nova-receita")
async def criar_receita(
    titulo: str = Form(...),
    descricao: str = Form(...),
    tempo: int = Form(...),
    porcoes: int = Form(...),
    ingredientes: str = Form(...),
    categoria: str = Form(...),
    imagem_arquivo: UploadFile = File(...) 
):
    try:
        # 1. Lógica para Salvar a Imagem
        # Gera um caminho único ou usa o nome original (cuidado com nomes duplicados)
        file_location = f"{UPLOAD_DIR}/{imagem_arquivo.filename}"
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(imagem_arquivo.file, buffer)

        # 2. Aqui você salvaria no Banco de Dados (Postgres, SQLite, etc.)
        # Exemplo fictício de objeto salvo:
        nova_receita = {
            "titulo": titulo,
            "descricao": descricao,
            "tempo": tempo,
            "porcoes": porcoes,
            "ingredientes": ingredientes,
            "categoria": categoria,
            "imagem_url": file_location # Salva o caminho da imagem no banco
        }
        
        print("Receita Salva:", nova_receita) # Log para debug

        return {"msg": "Receita criada com sucesso!", "receita": nova_receita}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar receita: {str(e)}")