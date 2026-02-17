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
    ingredientes: List[IngredienteSchema]
    categoria: List[int]
    imagem_path: Optional[str] = None

class ReceitaCreate(ReceitaBase):
    pass

class ReceitaResponse(ReceitaBase):
    id: int
    usuario_id: int

    class Config:
        from_attributes = True