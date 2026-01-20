from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from .base import Base

class Receita(Base):
    __tablename__ = "receitas"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("users.id"))
    titulo: Mapped[str] = mapped_column(nullable=False)
    descricao: Mapped[str] = mapped_column(nullable=False)
    tempo: Mapped[int] = mapped_column(nullable=False)
    porcoes: Mapped[int] = mapped_column(nullable=False)
    ingredientes: Mapped[str] = mapped_column(nullable=False)
    categoria: Mapped[str] = mapped_column(nullable=False)
    imagem_path: Mapped[str] = mapped_column(nullable=False)

    user: Mapped["User"] = relationship(back_populates="receitas") # type: ignore