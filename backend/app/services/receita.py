from sqlalchemy.orm import Session
from app.models.receita import Receita
from app.schemas.receita import ReceitaCreate


def create_receita(db: Session, receita: ReceitaCreate):
    db_receita = Receita(
        titulo=receita.titulo,
        descricao=receita.descricao,
        tempo=receita.tempo,
        porcoes=receita.porcoes,
        ingredientes=receita.ingredientes,
        categoria=receita.categoria,
        imagem_path=receita.imagem_path
    )

    db.add(db_receita)
    db.commit()
    db.refresh(db_receita)
    return db_receita