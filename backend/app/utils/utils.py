import unicodedata
from app.models import Receita
from app.schemas.receita import ReceitaResponse

def tratar_string(nome: str) -> str:
    """Remove acentos, espaços extras no início/fim e converte para maiúsculo."""
    # Remove acentos
    nome_sem_acento = unicodedata.normalize('NFD', nome)\
        .encode('ascii', 'ignore')\
        .decode('utf-8')
    # Remove espaços nas pontas e deixa maiúsculo
    return nome_sem_acento.strip().upper()

def _formatar_receita(receita: Receita) -> ReceitaResponse:
    return ReceitaResponse(
        id=receita.id,
        usuario_id=receita.usuario_id,
        usuario={"id": receita.user.id, "nome": receita.user.nome},
        titulo=receita.titulo,
        descricao=receita.descricao,
        tempo_minutos=receita.tempo_minutos,
        porcoes=receita.porcoes,
        imagem_path=receita.imagem_path,
        ingredientes=[
            {
                "nome": ri.ingrediente.nome,
                "quantidade": ri.quantidade,
                "unidade": ri.unidade
            } for ri in receita.ingredientes_link
        ],
        categorias=[cat.nome for cat in receita.categorias]
    )