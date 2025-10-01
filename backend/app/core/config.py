import os
from pydantic_settings import BaseSettings
from pydantic import PostgresDsn

class Settings(BaseSettings):
    ENVIRONMENT: str = "local"

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST_LOCAL: str
    POSTGRES_HOST_DOCKER: str
    POSTGRES_PORT: int = 5432

    @property
    def POSTGRES_HOST(self) -> str:
        if self.ENVIRONMENT == "local":
            return self.POSTGRES_HOST_LOCAL
        else:
            return self.POSTGRES_HOST_DOCKER

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

# Caminho absoluto para o .env
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
settings = Settings(_env_file=os.path.join(BASE_DIR, ".env"))
