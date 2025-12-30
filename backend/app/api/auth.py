from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from ..core.security import create_access_token, verify_password, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
from ..schemas.auth import LoginRequest, TokenResponse
from ..schemas.user import UserCreate, UserResponse
from ..models.user import User
from ..db.session import get_db
from ..services.user import create_user, get_user_by_email
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db=db, email=request.email)
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserResponse, status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db=db, email=user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-mail já cadastrado"
        )
    db_user = create_user(db=db, user=user)
    return db_user