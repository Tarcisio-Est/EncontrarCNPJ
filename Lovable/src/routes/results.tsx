import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  FileSpreadsheet,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Resultados — CNPJ Fast Search" },
      { name: "description", content: "Prévia dos CNPJs encontrados a partir da sua planilha." },
    ],
  }),
  component: ResultsPage,
});

type ResultRow = {
  razaoSocial: string;
  cnpj: string | null;
  status: "Encontrado" | "Não encontrado";
  cidadeUf?: string;
};

const MOCK_RESULTS: ResultRow[] = [
  { razaoSocial: "Padaria Bom Pão Ltda", cnpj: "12.345.678/0001-90", status: "Encontrado", cidadeUf: "São Paulo/SP" },
  { razaoSocial: "Tech Solutions S.A.", cnpj: "98.765.432/0001-12", status: "Encontrado", cidadeUf: "Rio de Janeiro/RJ" },
  { razaoSocial: "Construtora Alfa Ltda", cnpj: "11.222.333/0001-44", status: "Encontrado", cidadeUf: "Belo Horizonte/MG" },
  { razaoSocial: "Mercearia Central ME", cnpj: "55.444.333/0001-22", status: "Encontrado", cidadeUf: "Curitiba/PR" },
  { razaoSocial: "Comercial Beta Eireli", cnpj: null, status: "Não encontrado" },
  { razaoSocial: "Indústria Gama Ltda", cnpj: "77.888.999/0001-10", status: "Encontrado", cidadeUf: "Porto Alegre/RS" },
  { razaoSocial: "Serviços Delta XYZ", cnpj: null, status: "Não encontrado" },
  { razaoSocial: "Logística Épsilon S.A.", cnpj: "33.444.555/0001-66", status: "Encontrado", cidadeUf: "Salvador/BA" },
];

function ResultsPage() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string>("planilha.xlsx");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem("cnpj-fast:lastFile");
    if (!stored) {
      navigate({ to: "/" });
      return;
    }
    setFileName(stored);
  }, [navigate]);

  const { found, notFound } = useMemo(() => {
    return {
      found: MOCK_RESULTS.filter((r) => r.status === "Encontrado").length,
      notFound: MOCK_RESULTS.filter((r) => r.status === "Não encontrado").length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Search className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">CNPJ Fast Search</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Nova consulta
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Resultados da consulta
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="truncate">{fileName}</span>
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-success/30 bg-success-soft p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
                <CheckCircle2 className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-success">
                  CNPJs encontrados
                </p>
                <p className="mt-1 text-3xl font-extrabold text-foreground">{found}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/40 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <XCircle className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Não encontrados
                </p>
                <p className="mt-1 text-3xl font-extrabold text-foreground">{notFound}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview table */}
        <div className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Prévia dos resultados</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Mostrando os primeiros {MOCK_RESULTS.length} registros para conferência.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-cta transition hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              Baixar planilha completa
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Razão Social</th>
                    <th className="px-4 py-3 text-left font-semibold">CNPJ</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Cidade/UF</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RESULTS.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-border transition hover:bg-muted/40"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{r.razaoSocial}</td>
                      <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">
                        {r.cnpj ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {r.status === "Encontrado" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                            <CheckCircle2 className="h-3 w-3" /> Encontrado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                            <XCircle className="h-3 w-3" /> Não encontrado
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.cidadeUf ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Esta é apenas uma prévia. Baixe a planilha completa para acessar todos os registros processados.
          </p>
        </div>
      </main>
    </div>
  );
}
