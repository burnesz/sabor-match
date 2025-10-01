from fastapi import APIRouter, HTTPException, status
from datetime import timedelta
from ..core.security import create_access_token, verify_password, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
from ..schemas.auth import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

# ⚠️ Exemplo estático — depois você troca por banco de dados
fake_user = {
    "email": "teste@email.com",
    "hashed_password": get_password_hash("123456"),
}


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    if request.email != fake_user["email"] or not verify_password(request.password, fake_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": request.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
