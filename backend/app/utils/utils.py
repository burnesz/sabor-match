import unicodedata

def tratar_string(nome: str) -> str:
    """Remove acentos, espaços extras no início/fim e converte para maiúsculo."""
    # Remove acentos
    nome_sem_acento = unicodedata.normalize('NFD', nome)\
        .encode('ascii', 'ignore')\
        .decode('utf-8')
    # Remove espaços nas pontas e deixa maiúsculo
    return nome_sem_acento.strip().upper()