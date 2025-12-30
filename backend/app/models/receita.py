from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Receita(Base):
    __tablename__ = "receitas"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(nullable=False)
    descricao: Mapped[str] = mapped_column(nullable=False)
    tempo: Mapped[int] = mapped_column(nullable=False)
    porcoes: Mapped[int] = mapped_column(nullable=False)
    ingredientes: Mapped[str] = mapped_column(nullable=False)
    categoria: Mapped[str] = mapped_column(nullable=False)
    imagem_path: Mapped[str] = mapped_column(nullable=False)