FROM python:3.13-slim

# Dependências do sistema
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copiar código
COPY . .

