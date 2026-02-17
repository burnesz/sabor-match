from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .receita import Receita
    
class Categoria(Base):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # Note o secondary="receita_categoria" (nome da tabela da classe nova)
    receitas: Mapped[List["Receita"]] = relationship(
        secondary="receita_categorias", 
        back_populates="categorias"
    )
