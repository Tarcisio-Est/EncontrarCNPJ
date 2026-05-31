import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.responses import Response
from routes import cnpj_sem_ia
from datetime import datetime

# ---------------------------
# Inicializa o FastAPI
# ---------------------------
app = FastAPI()

from starlette.requests import Request
from starlette.responses import Response

class ReceiveWrapper:
    def __init__(self, body):
        self.body = body
        self.consumed = False

    async def __call__(self):
        if not self.consumed:
            self.consumed = True
            return {"type": "http.request", "body": self.body}
        return {"type": "http.request", "body": b""}

class AsyncIteratorWrapper:
    def __init__(self, data):
        self.data = data
        self.sent = False

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.sent:
            raise StopAsyncIteration
        self.sent = True
        return self.data

# Captura erros globais
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(content={"detail": "Ocorreu um erro interno"}, status_code=500)

# Inclui as rotas
app.include_router(cnpj_sem_ia.router)
