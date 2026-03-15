from fastapi import FastAPI
from .api import auth, receitas, uploads, usuarios
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.include_router(auth.router)
app.include_router(receitas.router)
app.include_router(uploads.router)
app.include_router(usuarios.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configuração do CORS
origins = [
    "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173" # endereço do seu frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],       # permite POST, GET, OPTIONS etc.
    allow_headers=["*"],       # permite todos os headers
)
