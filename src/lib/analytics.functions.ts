import { supabase } from "@/integrations/supabase/client";

type RangeInput = { start: string; end: string; label?: string };

function detectDevice(ua: string | null | undefined): "mobile" | "tablet" | "desktop" {
  const s = (ua ?? "").toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(s)) return "tablet";
  if (/mobi|iphone|android.*mobile/.test(s)) return "mobile";
  return "desktop";
}

function isoDay(d: string) {
  return d.slice(0, 10);
}

export async function getAnalyticsOverview(data: RangeInput) {
  const [eventsRes, sessionsRes, leadsRes] = await Promise.all([
    supabase.from("analytics_events").select("event_type,path,target,visitor_id,session_id,created_at,meta").gte("created_at", data.start).lte("created_at", data.end).limit(50000),
    supabase.from("analytics_sessions").select("id,visitor_id,started_at,landing_path,referrer,utm_source,utm_medium,utm_campaign,user_agent").gte("started_at", data.start).lte("started_at", data.end).limit(50000),
    supabase.from("analytics_leads").select("*").gte("created_at", data.start).lte("created_at", data.end).order("created_at", { ascending: false }).limit(500),
  ]);

  if (eventsRes.error) throw new Error(eventsRes.error.message);
  if (sessionsRes.error) throw new Error(sessionsRes.error.message);
  if (leadsRes.error) throw new Error(leadsRes.error.message);

  const events = eventsRes.data ?? [];
  const sessions = sessionsRes.data ?? [];
  const leads = leadsRes.data ?? [];
  const uniqueVisitors = new Set(events.map((e) => e.visitor_id)).size;
  const pageViews = events.filter((e) => e.event_type === "page_view").length;
  const conversions = events.filter((e) => e.event_type === "conversion").length;
  const conversionRate = uniqueVisitors ? (conversions / uniqueVisitors) * 100 : 0;

  const dayMap = new Map<string, { date: string; visitors: Set<string>; sessions: number; pageViews: number; conversions: number }>();
  for (const e of events) {
    const d = isoDay(e.created_at);
    if (!dayMap.has(d)) dayMap.set(d, { date: d, visitors: new Set(), sessions: 0, pageViews: 0, conversions: 0 });
    const row = dayMap.get(d)!;
    row.visitors.add(e.visitor_id);
    if (e.event_type === "page_view") row.pageViews += 1;
    if (e.event_type === "conversion") row.conversions += 1;
  }
  for (const s of sessions) {
    const d = isoDay(s.started_at);
    if (!dayMap.has(d)) dayMap.set(d, { date: d, visitors: new Set(), sessions: 0, pageViews: 0, conversions: 0 });
    dayMap.get(d)!.sessions += 1;
  }

  const pageCount = new Map<string, number>();
  events.filter((e) => e.event_type === "page_view").forEach((e) => pageCount.set(e.path, (pageCount.get(e.path) ?? 0) + 1));
  const sourceMap = new Map<string, { source: string; sessions: number; conversions: number }>();
  for (const s of sessions) {
    let source = s.utm_source || "direto";
    if (!s.utm_source && s.referrer) {
      try { source = new URL(s.referrer).hostname.replace(/^www\./, ""); } catch { source = "direto"; }
    }
    if (!sourceMap.has(source)) sourceMap.set(source, { source, sessions: 0, conversions: 0 });
    sourceMap.get(source)!.sessions += 1;
  }
  for (const l of leads) {
    let source = l.utm_source || "direto";
    if (!l.utm_source && l.referrer) {
      try { source = new URL(l.referrer).hostname.replace(/^www\./, ""); } catch { source = "direto"; }
    }
    if (!sourceMap.has(source)) sourceMap.set(source, { source, sessions: 0, conversions: 0 });
    sourceMap.get(source)!.conversions += 1;
  }

  const campaignMap = new Map<string, { campaign: string; sessions: number; conversions: number }>();
  for (const s of sessions) {
    if (!s.utm_campaign) continue;
    if (!campaignMap.has(s.utm_campaign)) campaignMap.set(s.utm_campaign, { campaign: s.utm_campaign, sessions: 0, conversions: 0 });
    campaignMap.get(s.utm_campaign)!.sessions += 1;
  }
  for (const l of leads) {
    if (!l.utm_campaign) continue;
    if (!campaignMap.has(l.utm_campaign)) campaignMap.set(l.utm_campaign, { campaign: l.utm_campaign, sessions: 0, conversions: 0 });
    campaignMap.get(l.utm_campaign)!.conversions += 1;
  }

  const devices = { mobile: 0, desktop: 0, tablet: 0 };
  for (const s of sessions) devices[detectDevice(s.user_agent)] += 1;
  const ctaMap = new Map<string, number>();
  events.filter((e) => e.event_type === "click" || e.event_type === "conversion").forEach((e) => ctaMap.set(e.target || "outro", (ctaMap.get(e.target || "outro") ?? 0) + 1));

  return {
    range: data,
    totals: { visitors: uniqueVisitors, sessions: sessions.length, pageViews, conversions, conversionRate: Math.round(conversionRate * 100) / 100, leads: leads.length },
    timeseries: Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date)).map((r) => ({ date: r.date, visitors: r.visitors.size, sessions: r.sessions, pageViews: r.pageViews, conversions: r.conversions })),
    topPages: Array.from(pageCount.entries()).map(([path, views]) => ({ path, views })).sort((a, b) => b.views - a.views).slice(0, 10),
    topSources: Array.from(sourceMap.values()).sort((a, b) => b.sessions - a.sessions).slice(0, 10),
    topCampaigns: Array.from(campaignMap.values()).sort((a, b) => b.sessions - a.sessions).slice(0, 10),
    topCtas: Array.from(ctaMap.entries()).map(([target, count]) => ({ target, count })).sort((a, b) => b.count - a.count).slice(0, 10),
    devices,
    recentLeads: leads.slice(0, 100).map((l) => ({ id: l.id, created_at: l.created_at, source_event: l.source_event, path: l.path, utm_source: l.utm_source, utm_medium: l.utm_medium, utm_campaign: l.utm_campaign, referrer: l.referrer })),
  };
}

export async function generateAnalyticsPdf(data: RangeInput) {
  const overview = await getAnalyticsOverview(data);
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0.08, 0.08, 0.09);
  const red = rgb(0.85, 0.1, 0.15);
  page.drawRectangle({ x: 0, y: 690, width: 595.28, height: 151.89, color: black });
  page.drawText("RUSSO", { x: 48, y: 765, size: 34, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Relatório de performance", { x: 48, y: 735, size: 12, font, color: rgb(0.86, 0.86, 0.86) });
  page.drawText(data.label ?? "Período selecionado", { x: 48, y: 640, size: 22, font: bold, color: black });
  const kpis = [
    ["Visitantes únicos", overview.totals.visitors],
    ["Sessões", overview.totals.sessions],
    ["Páginas vistas", overview.totals.pageViews],
    ["Conversões", overview.totals.conversions],
    ["Leads", overview.totals.leads],
    ["Taxa de conversão", `${overview.totals.conversionRate}%`],
  ];
  kpis.forEach(([label, value], i) => {
    const x = 48 + (i % 3) * 165;
    const y = 560 - Math.floor(i / 3) * 82;
    page.drawRectangle({ x, y, width: 148, height: 58, color: rgb(0.95, 0.95, 0.96) });
    page.drawRectangle({ x, y, width: 4, height: 58, color: red });
    page.drawText(String(label).toUpperCase(), { x: x + 12, y: y + 38, size: 8, font: bold, color: rgb(0.42, 0.42, 0.45) });
    page.drawText(String(value), { x: x + 12, y: y + 14, size: 22, font: bold, color: black });
  });
  let y = 355;
  page.drawText("Páginas mais visitadas", { x: 48, y, size: 14, font: bold, color: black });
  y -= 24;
  overview.topPages.slice(0, 10).forEach((p) => {
    page.drawText(p.path.slice(0, 60), { x: 48, y, size: 9, font, color: black });
    page.drawText(String(p.views), { x: 510, y, size: 9, font: bold, color: red });
    y -= 16;
  });
  const bytes = await doc.save();
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return { base64: btoa(bin), filename: `russo-analytics-${data.start.slice(0, 10)}-${data.end.slice(0, 10)}.pdf` };
}