from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String
from .base import Base

if TYPE_CHECKING:
    from .receita import Receita
    from .ingrediente import Ingrediente


class ReceitaCategoria(Base):
    __tablename__ = "receita_categorias"

    receita_id: Mapped[int] = mapped_column(ForeignKey("receitas.id"), primary_key=True)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("categorias.id"), primary_key=True)
    
class ReceitaIngrediente(Base):
    __tablename__ = "receita_ingredientes"

    receita_id: Mapped[int] = mapped_column(ForeignKey("receitas.id"), primary_key=True)
    ingrediente_id: Mapped[int] = mapped_column(ForeignKey("ingredientes.id"), primary_key=True)
    
    quantidade: Mapped[float] = mapped_column(nullable=False)
    unidade: Mapped[str] = mapped_column(String(20), nullable=False)

    receita: Mapped["Receita"] = relationship(back_populates="ingredientes_link")
    ingrediente: Mapped["Ingrediente"] = relationship()

class ReceitaFavorita(Base):
    __tablename__ = "receita_favoritas"

    usuario_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    receita_id: Mapped[int] = mapped_column(ForeignKey("receitas.id"), primary_key=True)