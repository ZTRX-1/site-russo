import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Users, Activity, MessageCircle, FileText, Eye, TrendingUp, TrendingDown,
  Plus, BarChart3, Settings, UserCog, ExternalLink, ArrowRight, Package,
  Search, Globe, Link as LinkIcon, MousePointerClick, Sparkles,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { getDashboardOverview } from "@/lib/dashboard.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

type Preset = "d7" | "d30" | "d90";

function fmtNumber(n: number) {
  return new Intl.NumberFormat("pt-BR").format(n);
}
function fmtDelta(v: number) {
  const s = v > 0 ? "+" : "";
  return `${s}${v}%`;
}
function fmtShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `há ${hr}h`;
  const d = Math.floor(hr / 24);
  return `há ${d}d`;
}

function AdminDashboard() {
  const [preset, setPreset] = useState<Preset>("d7");
  const fn = useServerFn(getDashboardOverview);
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-card" />
          ))}
        </div>
      </div>
    );
  }

  const w = data.windows[preset];
  const sourceTotal = data.sources.ads + data.sources.organic + data.sources.direct + data.sources.referral;
  const sourceData = [
    { name: "Google Ads", value: data.sources.ads, color: "#e11d2e" },
    { name: "Orgânico", value: data.sources.organic, color: "#16a34a" },
    { name: "Direto", value: data.sources.direct, color: "#3b82f6" },
    { name: "Referência", value: data.sources.referral, color: "#a855f7" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_theme(colors.green.500)]" />
            {data.activeNow} {data.activeNow === 1 ? "usuário ativo agora" : "usuários ativos agora"}
          </div>
          <h1 className="mt-1 font-display text-3xl font-black text-foreground sm:text-4xl">Painel Russo</h1>
          <p className="text-sm text-muted-foreground">Visão geral da operação — dados em tempo real do site.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 text-xs">
          {(["d7", "d30", "d90"] as Preset[]).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`rounded-md px-3 py-1.5 font-bold uppercase tracking-wider transition ${
                preset === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "d7" ? "7 dias" : p === "d30" ? "30 dias" : "90 dias"}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs principais */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Visitantes únicos" value={w.current.visitors} delta={w.deltaVisitors} accent />
        <Kpi icon={Eye} label="Páginas vistas" value={w.current.pageViews} delta={w.deltaPageViews} />
        <Kpi icon={MessageCircle} label="Cliques WhatsApp" value={w.current.whatsappClicks} delta={w.deltaWhatsApp} accent />
        <Kpi icon={Sparkles} label="Conversões" value={w.current.conversions} />
      </div>

      {/* Ações rápidas */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Ações rápidas
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <QuickAction to="/admin/posts/new" icon={Plus} label="Novo post" primary />
          <QuickAction to="/admin/posts" icon={FileText} label="Gerenciar posts" />
          <QuickAction to="/admin/analytics" icon={BarChart3} label="Ver Analytics" />
          <QuickAction to="/admin/users" icon={UserCog} label="Gerenciar equipe" />
          <QuickAction to="/admin" icon={Settings} label="Configurações" disabled />
        </div>
      </div>

      {/* Gráfico + Origem */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Últimos 30 dias</div>
              <div className="font-display text-lg font-black">Visitantes e páginas vistas</div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeseries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d2e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#e11d2e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#18181b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#18181b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="date" tickFormatter={fmtShortDate} fontSize={11} stroke="#9ca3af" />
                <YAxis fontSize={11} stroke="#9ca3af" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                  labelFormatter={(v) => fmtShortDate(String(v))}
                />
                <Area type="monotone" dataKey="pageViews" stroke="#18181b" fill="url(#gPv)" strokeWidth={2} name="Páginas" />
                <Area type="monotone" dataKey="visitors" stroke="#e11d2e" fill="url(#gVis)" strokeWidth={2} name="Visitantes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Origem do tráfego (30d)</div>
          <div className="font-display text-lg font-black">De onde vêm os visitantes</div>
          {sourceTotal === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              Ainda sem dados. Assim que o site receber tráfego real, aparece aqui.
            </div>
          ) : (
            <>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={2}>
                      {sourceData.map((s) => <Cell key={s.name} fill={s.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1.5">
                {sourceData.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                      <SourceIcon name={s.name} />
                      {s.name}
                    </span>
                    <span className="font-mono font-bold">{s.value} <span className="text-muted-foreground">({sourceTotal ? Math.round((s.value / sourceTotal) * 100) : 0}%)</span></span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Blog + Últimos acessos */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Blog</div>
              <div className="font-display text-lg font-black">Desempenho editorial</div>
            </div>
            <Link to="/admin/posts" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <MiniStat label="Publicados" value={data.posts.published} />
            <MiniStat label="Rascunhos" value={data.posts.drafts} />
            <MiniStat label="Views 30d" value={data.posts.blogViews30d} delta={data.posts.deltaBlogViews} />
          </div>
          <div className="mt-4">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Artigos mais lidos (90d)</div>
            {data.posts.topArticles.length === 0 ? (
              <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                Sem leituras registradas ainda.
              </div>
            ) : (
              <ul className="space-y-1">
                {data.posts.topArticles.map((a) => (
                  <li key={a.path} className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50">
                    <a href={a.path} target="_blank" rel="noreferrer" className="truncate font-medium hover:text-primary">{a.title}</a>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{fmtNumber(a.views)} views</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Últimos acessos</div>
          <div className="font-display text-lg font-black">Em tempo real</div>
          {data.recentPageviews.length === 0 ? (
            <div className="mt-4 rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              Sem atividade recente.
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {data.recentPageviews.map((p, i) => (
                <li key={i} className="flex items-start gap-2 border-b border-border/40 pb-2 text-xs last:border-0">
                  <MousePointerClick className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{p.title || p.path}</div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="truncate">{p.path}</span>
                      <span className="ml-2 shrink-0">{fmtRelative(p.when)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Placeholder catálogo + resumo */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Package className="h-3.5 w-3.5" /> Catálogo (em breve)
          </div>
          <div className="mt-1 font-display text-lg font-black">Produtos e categorias mais acessadas</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Assim que o catálogo online for ativado, este bloco passa a mostrar os produtos e categorias mais visualizadas pelos clientes.
          </p>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 flex-1 rounded-md bg-muted/50" />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resumo rápido</div>
          <div className="font-display text-lg font-black">Operação no período</div>
          <ul className="mt-3 space-y-1.5 text-sm">
            <ResumeLine label="Sessões" value={fmtNumber(w.current.sessions)} />
            <ResumeLine label="Visitantes únicos" value={fmtNumber(w.current.visitors)} delta={w.deltaVisitors} />
            <ResumeLine label="Páginas vistas" value={fmtNumber(w.current.pageViews)} delta={w.deltaPageViews} />
            <ResumeLine label="Cliques no WhatsApp" value={fmtNumber(w.current.whatsappClicks)} delta={w.deltaWhatsApp} />
            <ResumeLine label="Conversões registradas" value={fmtNumber(w.current.conversions)} />
            <ResumeLine label="Leads (últimos 90d)" value={fmtNumber(data.leads.total90d)} />
          </ul>
          <a href="/blog" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline">
            Abrir blog público <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, delta, accent }: { icon: typeof Users; label: string; value: number; delta?: number; accent?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 ${accent ? "border-primary/30 bg-gradient-to-br from-card to-primary/5" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between">
        <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${accent ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}>
          <Icon className="h-4 w-4" />
        </div>
        {typeof delta === "number" && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            delta > 0 ? "bg-green-100 text-green-700" : delta < 0 ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground"
          }`}>
            {delta > 0 ? <TrendingUp className="h-3 w-3" /> : delta < 0 ? <TrendingDown className="h-3 w-3" /> : null}
            {fmtDelta(delta)}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-black text-foreground">{fmtNumber(value)}</div>
      <div className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, primary, disabled }: { to: string; icon: typeof Plus; label: string; primary?: boolean; disabled?: boolean }) {
  const cls = `group flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
    primary ? "border-primary bg-primary text-primary-foreground hover:opacity-90" :
    disabled ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground" :
    "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
  }`;
  if (disabled) return (
    <div className={cls}>
      <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {label}</span>
      <span className="text-[9px] font-bold uppercase">em breve</span>
    </div>
  );
  return (
    <Link to={to as "/admin"} className={cls}>
      <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {label}</span>
      <ArrowRight className="h-3.5 w-3.5 opacity-60 transition group-hover:translate-x-0.5" />
    </Link>
  );
}

function MiniStat({ label, value, delta }: { label: string; value: number; delta?: number }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3">
      <div className="font-display text-2xl font-black">{fmtNumber(value)}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      {typeof delta === "number" && (
        <div className={`mt-0.5 text-[10px] font-bold ${delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-muted-foreground"}`}>
          {fmtDelta(delta)}
        </div>
      )}
    </div>
  );
}

function ResumeLine({ label, value, delta }: { label: string; value: string; delta?: number }) {
  return (
    <li className="flex items-center justify-between border-b border-border/40 py-1 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 font-mono font-bold">
        {value}
        {typeof delta === "number" && (
          <span className={`text-[10px] ${delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-muted-foreground"}`}>
            {fmtDelta(delta)}
          </span>
        )}
      </span>
    </li>
  );
}

function SourceIcon({ name }: { name: string }) {
  if (name === "Google Ads") return <Search className="h-3 w-3 text-muted-foreground" />;
  if (name === "Orgânico") return <Globe className="h-3 w-3 text-muted-foreground" />;
  if (name === "Referência") return <LinkIcon className="h-3 w-3 text-muted-foreground" />;
  return <MousePointerClick className="h-3 w-3 text-muted-foreground" />;
}