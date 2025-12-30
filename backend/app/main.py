from fastapi import FastAPI
from .api import auth, receitas, uploads
from .core.dependencies import get_current_user
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(auth.router)
app.include_router(receitas.router)
app.include_router(uploads.router)

# Configuração do CORS
origins = [
    "http://localhost:3000", "http://localhost:5173" # endereço do seu frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],       # permite POST, GET, OPTIONS etc.
    allow_headers=["*"],       # permite todos os headers
)


@app.get("/private")
def private_route(email: str = Depends(get_current_user)):
    return {"msg": f"Olá, {email}!"}
