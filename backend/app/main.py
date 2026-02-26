from fastapi import FastAPI
from .api import auth, receitas, uploads
from .core.dependencies import get_current_user
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.include_router(auth.router)
app.include_router(receitas.router)
app.include_router(uploads.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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
