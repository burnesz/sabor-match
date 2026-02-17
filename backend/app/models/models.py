from typing import List, Optional
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

# 1. Tabela Associativa Explícita (Receita <-> Categoria)
class ReceitaCategoria(Base):
    __tablename__ = "receita_categoria"

    receita_id: Mapped[int] = mapped_column(ForeignKey("receitas.id"), primary_key=True)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("categorias.id"), primary_key=True)


# 2. Tabela Associativa Explícita (Receita <-> Ingrediente)
# Esta tem dados extras: quantidade e unidade
class ReceitaIngrediente(Base):
    __tablename__ = "receita_ingredientes"

    receita_id: Mapped[int] = mapped_column(ForeignKey("receitas.id"), primary_key=True)
    ingrediente_id: Mapped[int] = mapped_column(ForeignKey("ingredientes.id"), primary_key=True)
    
    quantidade: Mapped[float] = mapped_column(nullable=False)
    unidade: Mapped[str] = mapped_column(String(20), nullable=False)

    # Relacionamentos para navegar (ex: link.ingrediente.nome)
    receita: Mapped["Receita"] = relationship(back_populates="ingredientes_link")
    ingrediente: Mapped["Ingrediente"] = relationship()


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)

    receitas: Mapped[List["Receita"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Categoria(Base):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # Note o secondary="receita_categoria" (nome da tabela da classe nova)
    receitas: Mapped[List["Receita"]] = relationship(
        secondary="receita_categoria", 
        back_populates="categorias"
    )


class Ingrediente(Base):
    __tablename__ = "ingredientes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)


class Receita(Base):
    __tablename__ = "receitas"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
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
        secondary="receita_categoria", 
        back_populates="receitas"
    )