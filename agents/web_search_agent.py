from agno.agent import Agent
from agno.models.openrouter import OpenRouter
import httpx

from dotenv import load_dotenv

load_dotenv()

from config import OPENROUTER_MODEL, OPENROUTER_API_KEY
from agents.tools.cnpj_finder_skill import CNPJFinderSkill

SYSTEM_PROMPT = (
    "Você é um assistente brasileiro especializado em buscar CNPJs de empresas a partir da razão social delas. "
    "Use a ferramenta 'encontrar_cnpj' passando a razão social como argumento. "
    "Ela buscará candidatos na web e validará no BrasilAPI, retornando apenas o CNPJ mais confiável. "
    "Retorne APENAS o CNPJ no formato 00.000.000/0000-00 ou uma string vazia se não encontrar."
)
agent_ddg = Agent(
    model=OpenRouter(
        id=OPENROUTER_MODEL,
        api_key=OPENROUTER_API_KEY,
        temperature=0.2,
        max_tokens=1000,
        base_url="https://openrouter.ai/api/v1",
        http_client=httpx.Client(verify=False),
    ),
    instructions=SYSTEM_PROMPT,
    tools=[CNPJFinderSkill()],
)

