import logging
from services.cnpj_si_service import limpar_nome_empresa, extrair_cnpjs_validos
from agents.web_search_agent import agent_ddg

logger = logging.getLogger(__name__)

def extrair_CNPJ_com_ia(empresa: str) -> list:
    """
    Usa um agente de IA (Agno + OpenRouter) para buscar o CNPJ de uma empresa.

    Argumentos:
        empresa (str): Nome da empresa (pode vir sujo, será limpo internamente).

    Retorna:
        list: Lista com CNPJs válidos encontrados, ou lista vazia.
    """
    empresa_limpa = limpar_nome_empresa(empresa)
    if not empresa_limpa:
        return []

    try:
        resposta = agent_ddg.run(
            f"CNPJ {empresa_limpa}",
            timeout=30,
        )
        texto = resposta.content if resposta and resposta.content else ""
        cnpjs = extrair_cnpjs_validos(texto)
        if cnpjs:
            logger.info(f"IA encontrou CNPJ para '{empresa_limpa}': {cnpjs[0]}")
        else:
            logger.info(f"IA não encontrou CNPJ para '{empresa_limpa}'")
        return cnpjs
    except Exception as e:
        logger.error(f"Erro no fallback IA para '{empresa_limpa}': {e}")
        return []
