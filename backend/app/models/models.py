import os
import glob
import importlib.util

# Importa Base
from .base import Base

# Caminho da pasta de models
MODELS_DIR = os.path.dirname(__file__)

# Importa dinamicamente todos os arquivos .py (exceto base.py e models.py)
for filepath in glob.glob(os.path.join(MODELS_DIR, "*.py")):
    filename = os.path.basename(filepath)
    module_name, ext = os.path.splitext(filename)
    if module_name not in ("__init__", "base", "models"):
        spec = importlib.util.spec_from_file_location(f"app.models.{module_name}", filepath)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

# Expõe Base para Alembic
__all__ = ["Base"]
