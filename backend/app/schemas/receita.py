from pydantic import BaseModel
from typing import List, Optional

class IngredienteSchema(BaseModel):
    nome: str
    quantidade: float
    unidade: str

class UsuarioSimples(BaseModel):
    id: int
    nome: str

    class Config:
        from_attributes = True

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
    usuario: UsuarioSimples
    ingredientes: List[IngredienteSchema]
    categorias: List[str]

    class Config:
        from_attributes = True

class BuscaPaginada(BaseModel):
    items: List[ReceitaResponse]
    total_itens: int
    total_paginas: int
    pagina_atual: int
    tamanho_pagina: int

    class Config:
        from_attributes = True