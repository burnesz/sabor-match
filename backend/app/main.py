from fastapi import FastAPI
from .api import auth, receitas, uploads
from .core.dependencies import get_current_user
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()

app.include_router(auth.router)
app.include_router(receitas.router)
app.include_router(uploads.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configuração do CORS
origins = [
    "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://192.168.18.103:5173" # endereço do seu frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],       # permite POST, GET, OPTIONS etc.
    allow_headers=["*"],       # permite todos os headers
)