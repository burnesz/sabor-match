# Sabor Match

O **Sabor Match** é uma aplicação web *full-stack* desenvolvida para a partilha e descoberta de receitas culinárias. A plataforma permite aos utilizadores criar conta, autenticar-se, explorar um *feed* de receitas e publicar as suas próprias criações culinárias, incluindo detalhes como ingredientes, tempo de preparação e fotografias.

## 🚀 Tecnologias Utilizadas

### Backend
* **Linguagem:** Python 3.13
* **Framework:** FastAPI
* **Banco de Dados:** PostgreSQL 17
* **ORM:** SQLAlchemy
* **Gestão de Migrações:** Alembic
* **Autenticação:** JWT (JSON Web Tokens)

### Frontend
* **Framework:** React 19
* **Build Tool:** Vite
* **Estilos:** Tailwind CSS
* **Ícones:** FontAwesome
* **Routing:** React Router DOM

### Infraestrutura
* **Docker & Docker Compose:** Para orquestração de contentores e ambiente de desenvolvimento consistente.
* **Nginx:** Servidor web utilizado no contentor de produção do frontend.

---

## 📋 Pré-requisitos

Antes de começares, certifica-te de que tens as seguintes ferramentas instaladas:

* [Docker](https://www.docker.com/) e Docker Compose (Recomendado para uma configuração rápida).
* *Opcional (para execução local sem Docker):* Python 3.13+, Node.js 20+ e PostgreSQL.

---

## 🛠️ Instalação e Execução (Docker)

A forma mais simples de executar o projeto é através do Docker, que configura automaticamente a base de dados, o backend e o frontend.

1.  **Clonar o repositório:**
    ```bash
    git clone https://github.com/burnesz/sabor-match.git
    cd sabor-match
    ```

2.  **Configuração de Ambiente:**
    Verifica o ficheiro `backend/.env`. Para execução em Docker, a variável `ENVIRONMENT` deve ser definida como `docker` para que a aplicação comunique corretamente com o contentor da base de dados.

    Exemplo de `.env`:
    ```env
    ENVIRONMENT=local

    POSTGRES_USER=user
    POSTGRES_PASSWORD=senha
    POSTGRES_DB=database
    
    POSTGRES_HOST_LOCAL=localhost
    POSTGRES_HOST_DOCKER=db
    POSTGRES_PORT=5432
    
    SECRET_KEY=secret_key
    ```

3.  **Arrancar a Aplicação:**
    Na raiz do projeto, executa:
    ```bash
    docker-compose up --build
    ```

4.  **Aceder à Aplicação:**
    * **Frontend:** [http://localhost:3000](http://localhost:3000)
    * **Backend API:** [http://localhost:8000](http://localhost:8000)
    * **Documentação Interativa (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 💻 Execução Local (Manual)

Se preferires executar os serviços individualmente na tua máquina:

### Backend

1.  Navega para a pasta `backend`.
2.  Cria e ativa um ambiente virtual:
    ```bash
    python -m venv venv
    source venv/bin/activate  # No Windows: venv\Scripts\activate
    ```
3.  Instala as dependências:
    ```bash
    pip install -r requirements.txt
    ```
4.  No ficheiro `.env`, define `ENVIRONMENT=local` e certifica-te que tens um PostgreSQL a correr localmente.
5.  Executa as migrações da base de dados:
    ```bash
    alembic upgrade head
    ```
6.  Inicia o servidor:
    ```bash
    uvicorn app.main:app --reload
    ```

### Frontend

1.  Navega para a pasta `frontend`.
2.  Instala as dependências:
    ```bash
    npm install
    ```
3.  Inicia o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

---

## 📂 Estrutura do Projeto

```text
sabor-match/
├── backend/
│   ├── app/
│   │   ├── api/          # Endpoints da API (Auth, Receitas)
│   │   ├── core/         # Configurações de segurança e dependências
│   │   ├── db/           # Configuração da sessão de base de dados
│   │   ├── models/       # Modelos SQLAlchemy (Tabelas)
│   │   ├── schemas/      # Esquemas Pydantic (Validação de dados)
│   │   ├── utils/        # Funções que podem ser reutilizadas no código
│   │   └── main.py       # Ponto de entrada da aplicação FastAPI
│   ├── migrations/       # Versões de migração do Alembic
│   ├── uploads/          # Diretório para armazenamento de imagens
│   └── Dockerfile        #
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Funções de comunicação com o Backend
│   │   ├── components/   # Componentes reutilizáveis (Header, AuthWrapper)
│   │   ├── context/      # Contexto de Autenticação (AuthContext)
│   │   ├── hooks/        # Utilitários de lógica dentro da UI, importados nas views
│   │   ├── views/        # Páginas (Home, Login, Register, NovaReceita)
│   │   └── App.jsx       # Definição de rotas
│   └── Dockerfile        #
│
└── docker-compose.yaml   # Orquestração dos serviços
