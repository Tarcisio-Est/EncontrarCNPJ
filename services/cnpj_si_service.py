import re

from agents.tools.web_search_tool import buscar


def limpar_nome_empresa(empresa: str) -> str:
    """Remove emails e sufixos de domínio (.com, .com.br, etc.) do nome da empresa."""
    # Remove emails completos
    empresa = re.sub(r'\S+@\S+', '', empresa)
    # Remove sufixos de domínio grudados (ex: Engenharia.com, Ltda.com.br)
    empresa = re.sub(r'\.\s*(com|com\.br|org|net|br|io|gov|edu|info|me|co|biz)\s*\.?\s*(br|io|gov)?', '', empresa, flags=re.IGNORECASE)
    # Remove protocolos de URL
    empresa = re.sub(r'(https?://|www\.)', '', empresa, flags=re.IGNORECASE)
    # Remove URLs restantes simples (ex: empresa.com)
    empresa = re.sub(r'\S+\.(com|com\.br|org|net|br|io|gov|edu|info|me|co|biz)', '', empresa, flags=re.IGNORECASE)
    # Remove CPFs grudados ou separados por espaço (11 dígitos, com ou sem formatação)
    empresa = re.sub(r'\d{3}\.?\d{3}\.?\d{3}-?\d{2}', '', empresa)
    # Remove códigos/documentos numéricos no início antes do nome (ex: "51.581.045 Nome")
    empresa = re.sub(r'^\s*(?:\d[\d\.\-]*)+\s+', '', empresa)
     # Remove sufixos societários no final (LTDA, S/A, S.A, SA, EPP, ME, MEI, EIRELI, etc.)
    empresa = re.sub(r'[\s\-,./]*\s*(?:LTDA|Ltda|ltda|S/A|S\.A\.|S\.A|SA|EPP|MEI?|EIRELI|SS|S/C|FILIAL)\b', '', empresa)
    # Remove sigla de estado isolada no final (ex: " - RS", ", SP", " PR")
    
    return empresa.strip()



def extrair_CNPJ_sem_ia(empresa: str) -> list:
    empresa = limpar_nome_empresa(empresa)
    query = f"CNPJ {empresa}"

    try:
        resultados = buscar(query, max_results=3)
    except Exception:
        return []

    contexto = "\n".join([r["snippet"].strip() for r in resultados if r.get("snippet")])

    resposta = extrair_cnpjs_validos(contexto)
    return resposta


def validar_cnpj(cnpj: str) -> bool:
    """
    Valida um CNPJ utilizando o cálculo dos dígitos verificadores.
    
    Argumentos:
        cnpj (str): O CNPJ a ser validado, com ou sem formatação.
        
    Retorna:
        bool: True se o CNPJ for válido, False caso contrário.
    """
    cnpj = re.sub(r'[^0-9]', '', cnpj)
    
    if len(cnpj) != 14:
        return False
        
    if len(set(cnpj)) == 1:
        return False

    # Validação do primeiro dígito verificador
    soma = 0
    multiplicadores = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    for i, digito in enumerate(cnpj[:12]):
        soma += int(digito) * multiplicadores[i]
    
    resto = soma % 11
    digito_verificador_1 = 0 if resto < 2 else 11 - resto
    
    if int(cnpj[12]) != digito_verificador_1:
        return False

    # Validação do segundo dígito verificador
    soma = 0
    multiplicadores = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    for i, digito in enumerate(cnpj[:13]):
        soma += int(digito) * multiplicadores[i]
        
    resto = soma % 11
    digito_verificador_2 = 0 if resto < 2 else 11 - resto
    
    if int(cnpj[13]) != digito_verificador_2:
        return False

    return True

def extrair_cnpjs_validos(texto) -> list:
    """
    Extrai todos os CNPJs válidos encontrados em uma string.
    
    Argumentos:
        texto (str): A string onde os CNPJs serão procurados.
    
    Retorna:
        list: Lista de CNPJs válidos encontrados no formato original,
              ou lista vazia se nenhum CNPJ válido for encontrado.
    """
    # Regex para encontrar o padrão de CNPJ
    regex = r'\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}'
    
    possiveis_cnpjs = re.findall(regex, texto)
    
    cnpjs_validos = []
    for cnpj in possiveis_cnpjs:
        if validar_cnpj(cnpj) and cnpj not in cnpjs_validos:
            cnpjs_validos.append(cnpj)

    return cnpjs_validos