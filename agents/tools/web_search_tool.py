import logging
import time
from typing import List, Dict

import httpx
from bs4 import BeautifulSoup
from ddgs import DDGS

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
}

YAHOO_SEARCH_URL = "https://search.yahoo.com/search"
BING_SEARCH_URL = "https://www.bing.com/search"


def _extrair_texto(elemento) -> str:
    return elemento.get_text(separator=" ", strip=True) if elemento else ""


def _buscar_yahoo(query: str, max_results: int = 3) -> List[Dict[str, str]]:
    """Busca no Yahoo Search."""
    logger.info(f"[Yahoo] Query: {query} | max_results: {max_results}")
    resultados: List[Dict[str, str]] = []
    try:
        with httpx.Client(verify=False, headers=HEADERS, timeout=15) as client:
            params = {"p": query, "n": max_results}
            response = client.get(YAHOO_SEARCH_URL, params=params)
            response.raise_for_status()
    except Exception as e:
        logger.warning(f"Falha na busca Yahoo: {e}")
        return resultados

    soup = BeautifulSoup(response.text, "lxml")

    for item in soup.select("ol.searchCenterMiddle li"):
        title_elem = item.select_one("h3.title a")
        if not title_elem:
            title_elem = item.select_one("a")

        url_elem = item.select_one("span.url")
        if not url_elem:
            url_elem = item.select_one("cite")

        snippet_elem = item.select_one("p")
        if not snippet_elem:
            snippet_elem = item.select_one("span.d-ib.l-h-24")

        title = _extrair_texto(title_elem)
        url = _extrair_texto(url_elem)
        snippet = _extrair_texto(snippet_elem)

        if title or snippet:
            resultados.append({
                "title": title,
                "url": url,
                "snippet": snippet,
            })

    logger.info(f"Busca Yahoo retornou {len(resultados)} resultados para: {query}")
    return resultados

def _buscar_ddg(query: str, max_results: int = 3) -> List[Dict[str, str]]:
    """Busca no DuckDuckGo como último fallback."""
    print(f"[DDG] Query: {query} | max_results: {max_results}, Aq")
    resultados: List[Dict[str, str]] = []
    try:
        with DDGS() as ddgs:
            results = ddgs.text(
                query=query,
                region="br-pt",
                max_results=3,
                backend="Yahoo"
            )
            for r in results:
                resultados.append({
                    "title": r.get("title", ""),
                    "url": r.get("href", ""),
                    "snippet": r.get("body", ""),
                })
    except Exception as e:
        logger.warning(f"Falha na busca DDG: {e}")
        return resultados

    logger.info(f"Busca DDG retornou {len(resultados)} resultados para: {query}")
    return resultados


def buscar(query: str, max_results: int = 3) -> List[Dict[str, str]]:
    """
    Realiza busca web direta via scraping.
    Tenta Yahoo primeiro, cai para DDG se falhar.
    Retorna lista de dicts: {"title", "url", "snippet"}.
    """
    time.sleep(1.5)  # delay para evitar rate limit
    resultados = _buscar_yahoo(query, max_results)
    if resultados:
        return resultados

    logger.info("Yahoo sem resultados, tentando DDG...")
    time.sleep(1.5)
    resultados = _buscar_ddg(query, max_results)

    return resultados
