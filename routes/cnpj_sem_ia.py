from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import Pergunta
from services.cnpj_resolver import resolver_cnpj
import pandas as pd
import io

router = APIRouter()

@router.post("/encontrar_cnpj")
def encontrar_cnpj(pergunta: Pergunta):
    resultado = resolver_cnpj(pergunta.pergunta)
    return {
        "resposta": resultado["cnpj"],
        "fonte": resultado["fonte"],
        "match_score": resultado.get("match_score", 0.0),
    }


@router.post("/encontrar_cnpj/arquivo")
def encontrar_cnpj_por_arquivo(arquivo: UploadFile = File(...)):
    nome = arquivo.filename or ""
    extensao = nome.lower().split(".")[-1] if "." in nome else ""
    if extensao not in ("csv", "xlsx", "xls"):
        raise HTTPException(status_code=400, detail="Arquivo deve ser CSV ou XLSX")

    conteudo = arquivo.file.read()

    try:
        if extensao == "csv":
            df = pd.read_csv(io.BytesIO(conteudo))
        else:
            df = pd.read_excel(io.BytesIO(conteudo))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler arquivo: {e}")

    coluna_alvo = None
    for col in df.columns:
        col_norm = str(col).strip().lower().replace("_", " ").replace("ã", "a")
        if col_norm in ("razao social", "razão social", "razaosocial"):
            coluna_alvo = col
            break

    if coluna_alvo is None:
        raise HTTPException(
            status_code=400,
            detail=f"Coluna 'razao social' não encontrada. Baixe e preencha o arquivo modelo."
        )

    dados = []
    for _, row in df.iterrows():
        razao = str(row[coluna_alvo]) if pd.notna(row[coluna_alvo]) else ""
        resultado = resolver_cnpj(razao) if razao.strip() else {"cnpj": "", "fonte": "", "match_score": 0.0}
        dados.append({
            "razao social": razao,
            "cnpj": resultado["cnpj"],
            "fonte": resultado["fonte"],
            "match_score": resultado.get("match_score", 0.0),
        })

    df_resultado = pd.DataFrame(dados)
    buffer = io.StringIO()
    df_resultado.to_csv(buffer, index=False)
    buffer.seek(0)

    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=resultado_cnpj.csv"}
    )
