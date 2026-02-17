from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from app.core.dependencies import get_current_user
from ..utils.file_upload import salvar_imagem


router = APIRouter(prefix="/uploads", tags=["Uploads"])

@router.post("/nova-receita-imagem")
def upload_imagem_receita(imagem: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    imagem_path = salvar_imagem(imagem)
    
    if not imagem_path:
        raise HTTPException(status_code=500, detail="Erro ao salvar a imagem")
    
    return {"msg": "Imagem carregada com sucesso!", "imagem_path": imagem_path}