import { createFileRoute } from "@tanstack/react-router";
import {
  FileSpreadsheet,
  Search,
  CheckCircle2,
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
  Wallet,
  ClipboardCheck,
  Database,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileUpload } from "@/components/FileUpload";
import { BestPractices } from "@/components/BestPractices";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <ForWho />
        <Benefits />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Search className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">CNPJ Fast Search</span>
          <span className="ml-1 inline-flex items-center rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
            100% Gratuito
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a href="#upload" className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 md:inline-flex">
            Começar agora
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.92 0.06 268 / 0.7), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-40 h-[300px] w-[300px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.94 0.08 150 / 0.45), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-20 text-center md:pb-32 md:pt-28">
        <div className="fade-in-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
          Ferramenta gratuita · Sem cadastro
        </div>

        <h1 className="fade-in-up text-balance text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
          Encontre o CNPJ de centenas de empresas
        </h1>

        <p className="fade-in-up mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
          Suba sua planilha com razões sociais e receba tudo preenchido automaticamente.
          Sem cadastro, sem custo.
        </p>

        <div id="upload" className="fade-in-up mx-auto mt-10 flex max-w-5xl flex-col items-stretch justify-center gap-5 md:flex-row md:items-start">
          <div className="flex flex-1 flex-col items-center gap-3 md:flex-[2]">
            <FileUpload />
            <p className="text-xs text-muted-foreground">
              Resultado instantâneo · Gratuito para sempre
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <FileSpreadsheet className="h-3.5 w-3.5" /> .xlsx
              <span className="mx-1 text-border">·</span>
              <FileSpreadsheet className="h-3.5 w-3.5" /> .csv
            </span>
          </div>
          <div className="flex flex-1 md:flex-[1]">
            <BestPractices />
          </div>
        </div>

        {/* Mock preview */}
        <div className="fade-in-up mx-auto mt-16 max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
              <span className="ml-3 text-xs text-muted-foreground">empresas.xlsx</span>
            </div>
            <div className="grid grid-cols-2 text-sm">
              <div className="border-r border-border">
                <div className="bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Razão Social
                </div>
                {["Padaria Bom Pão Ltda", "Tech Solutions S.A.", "Construtora Alfa", "Mercearia Central"].map((n) => (
                  <div key={n} className="border-t border-border px-4 py-2.5">{n}</div>
                ))}
              </div>
              <div>
                <div className="bg-success-soft px-4 py-2 text-xs font-semibold uppercase tracking-wide text-success">
                  CNPJ ✓
                </div>
                {["12.345.678/0001-90", "98.765.432/0001-12", "11.222.333/0001-44", "55.444.333/0001-22"].map((n) => (
                  <div key={n} className="border-t border-border px-4 py-2.5 font-mono text-[13px]">{n}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: FileSpreadsheet,
      title: "Suba sua planilha",
      desc: "Arquivo .xlsx ou .csv com coluna de razão social das empresas",
    },
    {
      icon: Search,
      title: "A ferramenta busca automaticamente",
      desc: "Cruzamos cada nome com a base da Receita Federal",
    },
    {
      icon: CheckCircle2,
      title: "Receba com os CNPJs",
      desc: "Baixe o mesmo arquivo agora com a coluna de CNPJ preenchida",
    },
  ];
  return (
    <section className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Processo</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Como funciona</h2>
          <p className="mt-4 text-muted-foreground">Três passos. Nenhum atrito.</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition hover:shadow-card">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <span className="text-3xl font-extrabold text-border">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute right-[-22px] top-1/2 hidden -translate-y-1/2 text-border md:block">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForWho() {
  const items = [
    { icon: Users, title: "Times Comerciais & LDRs", desc: "Prepare listas de prospecção completas sem sair do Excel" },
    { icon: Wallet, title: "Analistas Financeiros", desc: "Valide fornecedores e parceiros em massa antes de cadastrá-los" },
    { icon: ClipboardCheck, title: "Compras & Compliance", desc: "Consulte CNPJs em lote para due diligence e auditorias" },
    { icon: Database, title: "Operações & CRM", desc: "Enriqueça sua base de dados com informações fiscais sem esforço" },
  ];
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Casos de uso</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Feito para quem perde tempo buscando CNPJ um por um
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <it.icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className="text-base font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Zap, title: "Velocidade", desc: "O que levaria horas manuais, feito em segundos." },
    { icon: ShieldCheck, title: "Sem cadastro", desc: "Não pedimos e-mail, senha ou cartão. Só o arquivo." },
    { icon: BarChart3, title: "Resultado limpo", desc: "Receba de volta sua planilha original, só com os CNPJs adicionados." },
  ];
  return (
    <section className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Diferenciais</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Por que usar o CNPJ Fast Search?</h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="text-center md:text-left">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-primary shadow-soft md:mx-0">
                <it.icon className="h-7 w-7" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-primary py-24 text-primary-foreground md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
          Pronto para montar sua lista em minutos?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-primary-foreground/75 md:text-lg">
          Gratuito, sem cadastro, sem complicação.
        </p>
        <div className="mt-10">
          <a
            href="#upload"
            className="group inline-flex items-center gap-2 rounded-xl bg-success px-7 py-4 text-base font-semibold text-success-foreground shadow-cta transition hover:translate-y-[-1px] hover:opacity-95 md:text-lg"
          >
            Fazer upload agora
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold">CNPJ Fast Search</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Política de Privacidade</a>
            <a href="#" className="hover:text-foreground">Termos de Uso</a>
          </nav>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          CNPJ Fast Search não armazena seus arquivos. Os dados são processados e descartados após o download.
        </p>
      </div>
    </footer>
  );
}
