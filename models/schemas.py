from pydantic import BaseModel

class Pergunta(BaseModel):
    pergunta: str

class OutputAgent(BaseModel):
    cnpj: str