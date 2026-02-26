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

    class Config:
        from_attributes = True