from typing import List, TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

# O TRUQUE: Só importa para o editor de código (linter), não para o Python rodar
if TYPE_CHECKING:
    from .receita import Receita

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)

    receitas: Mapped[List["Receita"]] = relationship(back_populates="user", cascade="all, delete-orphan")