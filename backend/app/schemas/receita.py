from pydantic import BaseModel
from typing import List, Optional

class IngredienteSchema(BaseModel):
    nome: str
    quantidade: float
    unidade: str

class ReceitaBase(BaseModel):
    titulo: str
    descricao: str
    tempo_minutos: int
    porcoes: int
    imagem_path: Optional[str] = None

class ReceitaCreate(ReceitaBase):
    ingredientes: List[IngredienteSchema]
    categoria: List[int]

class ReceitaResponse(ReceitaBase):
    id: int
    usuario_id: int
    ingredientes: List[IngredienteSchema]
    categorias: List[int]  # or more detailed if needed

    class Config:
        from_attributes = True

class ReceitaCarrossel(BaseModel):
    id: int
    titulo: str
    tempo_minutos: int
    imagem_path: Optional[str] = None

    class Config:
        from_attributes = True