from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .user import User
    from .associacoes import ReceitaCategoria, ReceitaIngrediente
    from .categoria import Categoria

class Receita(Base):
    __tablename__ = "receitas"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    titulo: Mapped[str] = mapped_column(String(200), nullable=False)
    descricao: Mapped[str] = mapped_column(nullable=False)
    tempo_minutos: Mapped[int] = mapped_column(nullable=False)
    porcoes: Mapped[int] = mapped_column(nullable=False)
    imagem_path: Mapped[Optional[str]] = mapped_column(nullable=True)

    # RELACIONAMENTOS

    user: Mapped["User"] = relationship(back_populates="receitas")

    # Acesso complexo (com quantidade): Usa o objeto intermediário
    ingredientes_link: Mapped[List["ReceitaIngrediente"]] = relationship(
        back_populates="receita", 
        cascade="all, delete-orphan"
    )

    # Acesso simples (só a lista): Pula a tabela intermediária usando 'secondary'
    categorias: Mapped[List["Categoria"]] = relationship(
        secondary="receita_categorias", 
        back_populates="receitas"
    )

    favoritados: Mapped[List["User"]] = relationship(
        secondary="receita_favoritas", 
        back_populates="favoritas"
    )