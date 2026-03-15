from fastapi import APIRouter, HTTPException, Depends
from app.models.receita import Receita
from app.models.user import User
from app.core.dependencies import get_current_user
from ..db.session import get_db
from sqlalchemy.orm import Session
from app.utils.utils import _formatar_receita

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

@router.get("/{usuario_id}/perfil")
def obter_perfil_usuario(usuario_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    usuario = db.query(User).filter(User.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db_receitas = db.query(Receita).filter(Receita.usuario_id == usuario_id).order_by(Receita.id.desc()).all()
    receitas = [_formatar_receita(r) for r in db_receitas]
    
    return {
        "usuario": {"id": usuario.id, "nome": usuario.nome},
        "receitas": receitas,
        "total_receitas": len(receitas)
    }