from fastapi import APIRouter, HTTPException, Depends
from app.models.models import Categoria
from ..schemas.receita import ReceitaCreate, ReceitaResponse
from ..db.session import get_db
from sqlalchemy.orm import Session
from ..services.receita import create_receita
from ..utils.file_upload import deletar_imagem
from ..core.dependencies import get_current_user

router = APIRouter(prefix="/receitas", tags=["Receitas"])

@router.get("/listar_categorias")
def listar_categorias(db: Session = Depends(get_db)):
    categorias = db.query(Categoria).all()
    return categorias

@router.post("/nova-receita", response_model=ReceitaResponse, status_code=201)
def criar_receita(receita: ReceitaCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_receita = create_receita(db=db, receita=receita, usuario_id=current_user.id)
    if not db_receita:
        deletar_imagem(receita.imagem_path)
        raise HTTPException(status_code=500, detail="Erro ao criar a receita")
    return db_receita