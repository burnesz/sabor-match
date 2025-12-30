from pydantic import BaseModel, Field

class ReceitaBase(BaseModel):
    titulo: str
    descricao: str
    tempo: int
    porcoes: int
    ingredientes: str
    categoria: str
    imagem_path: str

class ReceitaCreate(ReceitaBase):
    pass

class ReceitaResponse(ReceitaBase):
    id: int

    class Config:
        from_attributes = True
