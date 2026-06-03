import { CheckCircle2, FileSpreadsheet, Columns, Sparkles } from "lucide-react";

export function BestPractices() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 text-left shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Boas práticas</h3>
      </div>
      <ul className="space-y-2.5 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <FileSpreadsheet className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            Use apenas arquivos no formato <strong className="font-medium text-foreground">CSV-UTF8</strong>.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Columns className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            A planilha deve conter uma coluna chamada{" "}
            <strong className="font-medium text-foreground">“Razão Social”</strong>.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <span>A saída sempre será em formato CSV.</span>
        </li>
      </ul>
    </div>
  );
}
