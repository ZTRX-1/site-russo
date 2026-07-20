import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getAnalyticsOverview, generateAnalyticsPdf } from "@/lib/analytics.functions";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Download, Users, MousePointerClick, Target, TrendingUp, Eye, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsPage,
});

type Preset = "24h" | "7d" | "30d" | "90d" | "180d" | "365d" | "custom";

const PRESETS: { id: Preset; label: string; days: number }[] = [
  { id: "24h", label: "24h", days: 1 },
  { id: "7d", label: "7 dias", days: 7 },
  { id: "30d", label: "30 dias", days: 30 },
  { id: "90d", label: "Trimestre", days: 90 },
  { id: "180d", label: "Semestre", days: 180 },
  { id: "365d", label: "12 meses", days: 365 },
];

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function AnalyticsPage() {
  const [preset, setPreset] = useState<Preset>("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [generating, setGenerating] = useState(false);

  const range = useMemo(() => {
    if (preset === "custom" && customStart && customEnd) {
      return { start: new Date(customStart).toISOString(), end: new Date(customEnd + "T23:59:59").toISOString(), label: `${customStart} a ${customEnd}` };
    }
    const p = PRESETS.find((p) => p.id === preset) ?? PRESETS[2];
    return { start: isoDaysAgo(p.days), end: new Date().toISOString(), label: p.label };
  }, [preset, customStart, customEnd]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["analytics", range.start, range.end],
    queryFn: () => getAnalyticsOverview({ start: range.start, end: range.end }),
    staleTime: 60_000,
  });

  async function handleExport() {
    setGenerating(true);
    try {
      const res = await generateAnalyticsPdf({ start: range.start, end: range.end, label: `Período: ${range.label}` });
      const blob = await (await fetch(`data:application/pdf;base64,${res.base64}`)).blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Relatório PDF gerado.");
    } catch (e) {
      toast.error("Falha ao gerar PDF: " + (e as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  const kpis = [
    { label: "Visitantes únicos", value: data?.totals.visitors ?? 0, icon: Users },
    { label: "Sessões", value: data?.totals.sessions ?? 0, icon: Eye },
    { label: "Páginas vistas", value: data?.totals.pageViews ?? 0, icon: MousePointerClick },
    { label: "Conversões", value: data?.totals.conversions ?? 0, icon: Target, highlight: true },
    { label: "Leads registrados", value: data?.totals.leads ?? 0, icon: Sparkles },
    { label: "Taxa de conversão", value: `${data?.totals.conversionRate ?? 0}%`, icon: TrendingUp },
  ];

  const deviceData = data ? [
    { name: "Mobile", value: data.devices.mobile },
    { name: "Desktop", value: data.devices.desktop },
    { name: "Tablet", value: data.devices.tablet },
  ] : [];
  const DEVICE_COLORS = ["#e11d2e", "#18181b", "#a1a1aa"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-300">
              <Sparkles className="h-3 w-3 text-primary" />
              Analytics interno
            </div>
            <h1 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-4xl">Painel de Performance</h1>
            <p className="mt-2 max-w-lg text-sm text-zinc-400">
              Rastreamento first-party de visitantes, campanhas e conversões da Russo Elétrica & Ferragens.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={generating || !data}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_10px_30px_-10px_rgba(225,29,46,0.6)] transition hover:brightness-110 disabled:opacity-60"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {generating ? "Gerando…" : "Exportar PDF"}
          </button>
        </div>

        {/* Range presets */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {PRESETS.map((p: any) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                preset === p.id ? "bg-primary text-primary-foreground" : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setPreset("custom")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              preset === "custom" ? "bg-primary text-primary-foreground" : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >Custom</button>
          {preset === "custom" && (
            <div className="flex items-center gap-2">
              <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white" />
              <span className="text-xs text-zinc-500">até</span>
              <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white" />
            </div>
          )}
          {isFetching && <Loader2 className="ml-2 h-3.5 w-3.5 animate-spin text-zinc-400" />}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label}
              className={`relative overflow-hidden rounded-xl border p-4 transition ${
                k.highlight ? "border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card" : "border-border bg-card"
              }`}>
              <Icon className={`absolute right-3 top-3 h-4 w-4 ${k.highlight ? "text-primary" : "text-muted-foreground/40"}`} />
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{k.label}</div>
              <div className="mt-2 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {isLoading ? "…" : k.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeseries */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Tráfego no período</h2>
          <span className="text-xs text-muted-foreground">Visitantes, sessões e conversões por dia</span>
        </div>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer>
            <AreaChart data={data?.timeseries ?? []}>
              <defs>
                <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e11d2e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#e11d2e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#18181b" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#18181b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickFormatter={fmtDate} fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} labelFormatter={fmtDate} />
              <Area type="monotone" dataKey="visitors" name="Visitantes" stroke="#e11d2e" strokeWidth={2} fill="url(#gVisitors)" />
              <Area type="monotone" dataKey="sessions" name="Sessões" stroke="#18181b" strokeWidth={2} fill="url(#gSessions)" />
              <Area type="monotone" dataKey="conversions" name="Conversões" stroke="#0ea5e9" strokeWidth={2} fill="transparent" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sources + Devices */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-bold">Fontes de tráfego</h2>
          <p className="text-xs text-muted-foreground">Origem das sessões e conversões atribuídas</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={data?.topSources ?? []} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" fontSize={11} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <YAxis type="category" dataKey="source" fontSize={11} width={120} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="sessions" name="Sessões" fill="#18181b" radius={[0, 4, 4, 0]} />
                <Bar dataKey="conversions" name="Conversões" fill="#e11d2e" radius={[0, 4, 4, 0]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-bold">Dispositivos</h2>
          <p className="text-xs text-muted-foreground">Distribuição das sessões</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={deviceData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {deviceData.map((_, i) => <Cell key={i} fill={DEVICE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Pages + CTA */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-bold">Páginas mais visitadas</h2>
          <div className="mt-4 space-y-2">
            {(data?.topPages ?? []).map((p: any) => {
              const max = data?.topPages[0]?.views ?? 1;
              const pct = (p.views / max) * 100;
              return (
                <div key={p.path} className="group">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-mono text-foreground">{p.path}</span>
                    <span className="font-bold tabular-nums">{p.views}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded bg-muted">
                    <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {(!data || data.topPages.length === 0) && (
              <p className="text-sm text-muted-foreground">Sem dados ainda no período selecionado.</p>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-bold">Eventos e cliques</h2>
          <div className="mt-4 space-y-2">
            {(data?.topCtas ?? []).map((c: any) => (
              <div key={c.target} className="flex items-center justify-between rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs">
                <span className="truncate font-medium">{c.target}</span>
                <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 font-bold text-primary tabular-nums">{c.count}</span>
              </div>
            ))}
            {(!data || data.topCtas.length === 0) && (
              <p className="text-sm text-muted-foreground">Nenhum clique registrado ainda.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-bold">Leads recentes</h2>
          <p className="text-xs text-muted-foreground">Conversões atribuídas por origem e campanha</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Data</th>
                <th className="px-4 py-2 text-left">Evento</th>
                <th className="px-4 py-2 text-left">Fonte</th>
                <th className="px-4 py-2 text-left">Campanha</th>
                <th className="px-4 py-2 text-left">Página</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentLeads ?? []).map((l: any) => (
                <tr key={l.id} className="border-t border-border/60">
                  <td className="px-4 py-2 text-xs tabular-nums">{new Date(l.created_at).toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-2"><span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">{l.source_event}</span></td>
                  <td className="px-4 py-2 text-xs">{l.utm_source || "direto"}</td>
                  <td className="px-4 py-2 text-xs">{l.utm_campaign || ","}</td>
                  <td className="px-4 py-2 font-mono text-xs">{l.path || ","}</td>
                </tr>
              ))}
              {(!data || data.recentLeads.length === 0) && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhuma conversão registrada no período.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}