import difflib
import logging
import re
from typing import Dict

import httpx

from services.cnpj_si_service import limpar_nome_empresa

logger = logging.getLogger(__name__)

BRASILAPI_URL = "https://brasilapi.com.br/api/cnpj/v1/{cnpj}"


def validar(cnpj: str, razao_social: str) -> Dict[str, object]:
    """
    Consulta BrasilAPI (gratuita e pública) para validar se o CNPJ
    corresponde à razão social informada.

    Retorna:
        {
            "valido": bool,
            "nome_encontrado": str,
            "match_score": float,  # 0.0 a 1.0
        }
    """
    cnpj_limpo = re.sub(r"[^0-9]", "", cnpj)
    if len(cnpj_limpo) != 14:
        return {"valido": False, "nome_encontrado": "", "match_score": 0.0}

    url = BRASILAPI_URL.format(cnpj=cnpj_limpo)

    try:
        with httpx.Client(verify=False, timeout=15) as client:
            response = client.get(url)
            response.raise_for_status()
            data = response.json()
    except Exception as e:
        logger.warning(f"Falha ao consultar BrasilAPI para {cnpj_limpo}: {e}")
        return {"valido": False, "nome_encontrado": "", "match_score": 0.0}

    nome_encontrado = data.get("razao_social", "") or data.get("nome_fantasia", "")
    if not nome_encontrado:
        return {"valido": False, "nome_encontrado": "", "match_score": 0.0}

    razao_limpa = limpar_nome_empresa(razao_social).lower()
    nome_limpa = limpar_nome_empresa(nome_encontrado).lower()

    match_score = difflib.SequenceMatcher(None, razao_limpa, nome_limpa).ratio()

    logger.info(
        f"BrasilAPI: CNPJ={cnpj_limpo} | "
        f"Nome='{nome_encontrado}' | Score={match_score:.2f}"
    )

    resultado = { "valido": match_score >= 0.5,
        "nome_encontrado": nome_encontrado,
        "match_score": round(match_score, 2)}
    
    print(f"Resultado: {resultado}") 

    return resultado
