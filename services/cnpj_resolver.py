import logging

from services.cnpj_si_service import extrair_CNPJ_sem_ia
from services.cnpj_ia_service import extrair_CNPJ_com_ia
from agents.tools.cnpj_validator_tool import validar

logger = logging.getLogger(__name__)


def resolver_cnpj(razao_social: str) -> dict:
    """
    Resolve o CNPJ de uma empresa tentando busca web direta primeiro,
    e fallback com IA se não encontrar.

    Argumentos:
        razao_social (str): Nome da empresa.

    Retorna:
        dict: {"cnpj": str, "fonte": "web" | "ia" | "", "match_score": float}
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

        # Se score < 0.80, consulta a IA
        if melhor_score_web < 0.80:
            logger.info(f"[resolver_cnpj] Score < 0.80, consultando IA...")
            cnpjs_ia = extrair_CNPJ_com_ia(razao_social)
            logger.info(f"[resolver_cnpj] IA retornou: {cnpjs_ia}")

            melhor_cnpj_ia = ""
            melhor_score_ia = 0.0
            for cnpj in cnpjs_ia:
                validacao = validar(cnpj, razao_social)
                if validacao.get("valido"):
                    score = validacao.get("match_score", 0.0)
                    if score > melhor_score_ia:
                        melhor_score_ia = score
                        melhor_cnpj_ia = cnpj

            if melhor_cnpj_ia:
                logger.info(
                    f"[resolver_cnpj] IA: {melhor_cnpj_ia} (score={melhor_score_ia})"
                )
                # Retorna o melhor entre web e IA
                if melhor_score_ia > melhor_score_web:
                    logger.info(f"[resolver_cnpj] IA venceu")
                    return {"cnpj": melhor_cnpj_ia, "fonte": "ia", "match_score": melhor_score_ia}
                else:
                    logger.info(f"[resolver_cnpj] Web venceu")

        return {"cnpj": melhor_cnpj_web, "fonte": "web", "match_score": melhor_score_web}

    logger.info(f"[resolver_cnpj] Nenhum CNPJ validado na web, chamando fallback IA...")
    cnpjs = extrair_CNPJ_com_ia(razao_social)
    logger.info(f"[resolver_cnpj] IA retornou: {cnpjs}")

    # Valida CNPJs retornados pela IA
    melhor_cnpj_ia = ""
    melhor_score_ia = 0.0
    for cnpj in cnpjs:
        validacao = validar(cnpj, razao_social)
        if validacao.get("valido"):
            score = validacao.get("match_score", 0.0)
            if score > melhor_score_ia:
                melhor_score_ia = score
                melhor_cnpj_ia = cnpj

    if melhor_cnpj_ia:
        logger.info(
            f"[resolver_cnpj] CNPJ validado via IA: {melhor_cnpj_ia} "
            f"(score={melhor_score_ia})"
        )
        return {"cnpj": melhor_cnpj_ia, "fonte": "ia", "match_score": melhor_score_ia}

    logger.warning(f"[resolver_cnpj] Nenhum CNPJ encontrado para: '{razao_social}'")
    return {"cnpj": "", "fonte": "", "match_score": 0.0}
