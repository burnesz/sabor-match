from fastapi import FastAPI
from .api import auth
from .core.dependencies import get_current_user
from fastapi import Depends

app = FastAPI()

app.include_router(auth.router)


@app.get("/private")
def private_route(email: str = Depends(get_current_user)):
    return {"msg": f"Olá, {email}!"}
