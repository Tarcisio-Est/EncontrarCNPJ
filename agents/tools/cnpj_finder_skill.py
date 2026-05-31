import json
import logging
from typing import List

from agno.tools import Toolkit, tool

from agents.tools.web_search_tool import buscar
from agents.tools.cnpj_validator_tool import validar as validar_cnpj_api
from services.cnpj_si_service import extrair_cnpjs_validos, limpar_nome_empresa

logger = logging.getLogger(__name__)


class CNPJFinderSkill(Toolkit):
    """
    Toolkit Agno que orquestra a busca de CNPJ via scraping web
    e validação cruzada na BrasilAPI, retornando o CNPJ mais confiável.
    """

    def __init__(self):
        super().__init__(name="cnpj_finder_skill")
        self.register(self.buscar_cnpj_web)
        self.register(self.validar_cnpj)
        self.register(self.encontrar_cnpj)

    def _buscar_cnpj_web(self, razao_social: str) -> List[str]:
        """Lógica interna: busca candidatos e retorna lista de CNPJs."""
        nome_limpo = limpar_nome_empresa(razao_social)
        if not nome_limpo:
            return []

        query = f"CNPJ {nome_limpo}"
        resultados = buscar(query, max_results=20)
        contexto = "\n".join(
            [
                f"{r.get('title','')}"
                f"\n{r.get('snippet','')}"
                f"\n{r.get('href','')}"
                for r in resultados
            ]
        )
        cnpjs = extrair_cnpjs_validos(contexto)

        logger.info(f"buscar_cnpj_web: {len(cnpjs)} candidatos para '{nome_limpo}'")
        return cnpjs

    def _validar_cnpj(self, cnpj: str, razao_social: str) -> dict:
        """Lógica interna: valida CNPJ e retorna dict."""
        return validar_cnpj_api(cnpj, razao_social)

    def _encontrar_cnpj(self, razao_social: str) -> str:
        """Lógica interna: orquestra busca + validação + ranking."""
        nome_limpo = limpar_nome_empresa(razao_social)
        if not nome_limpo:
            return ""

        candidatos = self._buscar_cnpj_web(razao_social)
        if not candidatos:
            logger.info(f"encontrar_cnpj: nenhum candidato para '{nome_limpo}'")
            return ""

        melhor_cnpj = ""
        melhor_score = 0.0

        for cnpj in candidatos:
            resultado = self._validar_cnpj(cnpj, razao_social)
            score = resultado.get("match_score", 0.0)
            if resultado.get("valido") and score > melhor_score:
                melhor_score = score
                melhor_cnpj = cnpj

        if melhor_cnpj:
            logger.info(
                f"encontrar_cnpj: '{nome_limpo}' -> {melhor_cnpj} (score={melhor_score:.2f})"
            )
        else:
            logger.info(f"encontrar_cnpj: nenhum CNPJ validado para '{nome_limpo}'")

        return melhor_cnpj

    @tool
    def buscar_cnpj_web(self, razao_social: str) -> str:
        """
        Busca na web CNPJs candidatos para uma razão social.
        Retorna os CNPJs encontrados separados por vírgula.
        """
        cnpjs = self._buscar_cnpj_web(razao_social)
        return ", ".join(cnpjs) if cnpjs else ""

    @tool
    def validar_cnpj(self, cnpj: str, razao_social: str) -> str:
        """
        Valida um CNPJ na BrasilAPI e compara com a razão social.
        Retorna um JSON com valido, nome_encontrado e match_score.
        """
        resultado = self._validar_cnpj(cnpj, razao_social)
        return json.dumps(resultado, ensure_ascii=False)

    @tool
    def encontrar_cnpj(self, razao_social: str) -> str:
        """
        Orquestração completa: busca candidatos na web, valida na BrasilAPI
        e retorna o CNPJ com maior score de confiança.
        Retorna apenas o CNPJ no formato 00.000.000/0000-00 ou vazio.
        """
        return self._encontrar_cnpj(razao_social)
