from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.models.user import User
from ..core.security import decode_access_token
from ..db.session import get_db
from sqlalchemy.orm import Session


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email = payload["sub"]  # retorna o email do usuário
    
    user = db.query(User).filter(User.email == email).first()
    
    if user is None:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
        
    return user # Retorna o objeto completo do SQLAlchemy
