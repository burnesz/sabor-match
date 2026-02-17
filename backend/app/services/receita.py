from sqlalchemy.orm import Session
from app.models.receita import Receita
from app.models.ingrediente import Ingrediente
from app.models.associacoes import ReceitaCategoria, ReceitaIngrediente
from app.schemas.receita import ReceitaCreate
from app.utils.utils import tratar_string

def create_receita(db: Session, receita: ReceitaCreate, usuario_id: int):
    try:
        db_receita = Receita(
            usuario_id=usuario_id,
            titulo=receita.titulo,
            descricao=receita.descricao,
            tempo_minutos=receita.tempo_minutos, 
            porcoes=receita.porcoes,
            imagem_path=receita.imagem_path
        )
        
        db.add(db_receita)
        db.flush() 

        for ing_data in receita.ingredientes:
            nome_normalizado = tratar_string(ing_data.nome)
            
            db_ingrediente = db.query(Ingrediente).filter(Ingrediente.nome == nome_normalizado).first()
            
            if not db_ingrediente:
                db_ingrediente = Ingrediente(nome=nome_normalizado)
                db.add(db_ingrediente)
                db.flush()

            receita_ingrediente_assoc = ReceitaIngrediente(
                receita_id=db_receita.id,
                ingrediente_id=db_ingrediente.id,
                quantidade=ing_data.quantidade,
                unidade=ing_data.unidade
            )
            db.add(receita_ingrediente_assoc)

        for categoria_id in receita.categoria:
            receita_categoria_assoc = ReceitaCategoria(
                receita_id=db_receita.id,
                categoria_id=categoria_id
            )
            db.add(receita_categoria_assoc)

        db.commit()
        db.refresh(db_receita)
        
        return {
        "id": db_receita.id,
        "usuario_id": db_receita.usuario_id,
        "titulo": db_receita.titulo,
        "descricao": db_receita.descricao,
        "tempo_minutos": db_receita.tempo_minutos,
        "porcoes": db_receita.porcoes,
        "ingredientes": receita.ingredientes,
        "categoria": receita.categoria,
        "imagem_path": db_receita.imagem_path
    }

    except Exception as e:
        db.rollback()
        raise e