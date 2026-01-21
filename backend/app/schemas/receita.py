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
    imagem_path: str = None

class ReceitaResponse(ReceitaBase):
    id: int
    id_usuario: int

    class Config:
        from_attributes = True
