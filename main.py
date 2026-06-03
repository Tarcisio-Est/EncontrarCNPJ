import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from routes import cnpj_sem_ia
from datetime import datetime
from starlette.requests import Request
from starlette.responses import Response

app = FastAPI()

# Permite o frontend se comunicar com a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(content={"detail": "Ocorreu um erro interno"}, status_code=500)

app.include_router(cnpj_sem_ia.router)