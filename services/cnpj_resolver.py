import logging

from services.cnpj_si_service import extrair_CNPJ_sem_ia
from agents.tools.cnpj_validator_tool import validar

logger = logging.getLogger(__name__)


def resolver_cnpj(razao_social: str) -> dict:
    """
    Resolve o CNPJ de uma empresa fazendo a busca na web direta.

    Argumentos:
        razao_social (str): Nome da empresa.

    Retorna:
        dict: {"cnpj": str, "fonte": "web", "match_score": float}
    """
    logger.info(f"[resolver_cnpj] Iniciando busca para: '{razao_social}'")

    cnpjs = extrair_CNPJ_sem_ia(razao_social)
    logger.info(f"[resolver_cnpj] Web retornou candidatos: {cnpjs}")

    # Valida todos os CNPJs encontrados na web e pega o de maior score
    melhor_cnpj_web = ""
    melhor_score_web = 0.0
    for cnpj in cnpjs:
        validacao = validar(cnpj, razao_social)
        if validacao.get("valido"):
            score = validacao.get("match_score", 0.0)
            if score > melhor_score_web:
                melhor_score_web = score
                melhor_cnpj_web = cnpj

    if melhor_cnpj_web:
        logger.info(
            f"[resolver_cnpj] CNPJ validado via WEB: {melhor_cnpj_web} "
            f"(score={melhor_score_web})"
        )
        return {"cnpj": melhor_cnpj_web, "fonte": "web", "match_score": melhor_score_web}

    return {"cnpj": "", "fonte": "web", "match_score": 0.0}
