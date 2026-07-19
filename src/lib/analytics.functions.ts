import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const rangeSchema = z.object({
  start: z.string(),
  end: z.string(),
});

type RangeInput = z.infer<typeof rangeSchema>;

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!isAdmin) throw new Error("Acesso restrito a administradores.");
}

function detectDevice(ua: string | null | undefined): "mobile" | "tablet" | "desktop" {
  const s = (ua ?? "").toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(s)) return "tablet";
  if (/mobi|iphone|android.*mobile/.test(s)) return "mobile";
  return "desktop";
}

function isoDay(d: string) {
  return d.slice(0, 10);
}

export const getAnalyticsOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: RangeInput) => rangeSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;

    const [eventsRes, sessionsRes, leadsRes] = await Promise.all([
      db.from("analytics_events")
        .select("event_type,path,target,visitor_id,session_id,created_at,meta")
        .gte("created_at", data.start)
        .lte("created_at", data.end)
        .limit(50000),
      db.from("analytics_sessions")
        .select("id,visitor_id,started_at,landing_path,referrer,utm_source,utm_medium,utm_campaign,user_agent")
        .gte("started_at", data.start)
        .lte("started_at", data.end)
        .limit(50000),
      db.from("analytics_leads")
        .select("*")
        .gte("created_at", data.start)
        .lte("created_at", data.end)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    const events = eventsRes.data ?? [];
    const sessions = sessionsRes.data ?? [];
    const leads = leadsRes.data ?? [];

    const uniqueVisitors = new Set(events.map((e: any) => e.visitor_id)).size;
    const pageViews = events.filter((e: any) => e.event_type === "page_view").length;
    const conversions = events.filter((e: any) => e.event_type === "conversion").length;
    const totalSessions = sessions.length;
    const conversionRate = uniqueVisitors ? (conversions / uniqueVisitors) * 100 : 0;

    // Timeseries per day
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
    const timeseries = Array.from(dayMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => ({ date: r.date, visitors: r.visitors.size, sessions: r.sessions, pageViews: r.pageViews, conversions: r.conversions }));

    // Top pages
    const pageCount = new Map<string, number>();
    events.filter((e: any) => e.event_type === "page_view").forEach((e: any) => {
      pageCount.set(e.path, (pageCount.get(e.path) ?? 0) + 1);
    });
    const topPages = Array.from(pageCount.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Sources
    const sourceMap = new Map<string, { source: string; sessions: number; conversions: number }>();
    for (const s of sessions) {
      const src = s.utm_source || (s.referrer ? new URL(s.referrer).hostname.replace(/^www\./, "") : "direto");
      const key = src || "direto";
      if (!sourceMap.has(key)) sourceMap.set(key, { source: key, sessions: 0, conversions: 0 });
      sourceMap.get(key)!.sessions += 1;
    }
    for (const l of leads) {
      const src = l.utm_source || (l.referrer ? (() => { try { return new URL(l.referrer).hostname.replace(/^www\./, ""); } catch { return "direto"; } })() : "direto");
      const key = src || "direto";
      if (!sourceMap.has(key)) sourceMap.set(key, { source: key, sessions: 0, conversions: 0 });
      sourceMap.get(key)!.conversions += 1;
    }
    const topSources = Array.from(sourceMap.values()).sort((a, b) => b.sessions - a.sessions).slice(0, 10);

    // Campaigns
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
    const topCampaigns = Array.from(campaignMap.values()).sort((a, b) => b.sessions - a.sessions).slice(0, 10);

    // Devices
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    for (const s of sessions) {
      devices[detectDevice(s.user_agent)] += 1;
    }

    // CTA breakdown from click events
    const ctaMap = new Map<string, number>();
    events.filter((e: any) => e.event_type === "click" || e.event_type === "conversion").forEach((e: any) => {
      const t = e.target || "outro";
      ctaMap.set(t, (ctaMap.get(t) ?? 0) + 1);
    });
    const topCtas = Array.from(ctaMap.entries())
      .map(([target, count]) => ({ target, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      range: data,
      totals: {
        visitors: uniqueVisitors,
        sessions: totalSessions,
        pageViews,
        conversions,
        conversionRate: Math.round(conversionRate * 100) / 100,
        leads: leads.length,
      },
      timeseries,
      topPages,
      topSources,
      topCampaigns,
      topCtas,
      devices,
      recentLeads: leads.slice(0, 100).map((l: any) => ({
        id: l.id,
        created_at: l.created_at,
        source_event: l.source_event,
        path: l.path,
        utm_source: l.utm_source,
        utm_medium: l.utm_medium,
        utm_campaign: l.utm_campaign,
        referrer: l.referrer,
      })),
    };
  });

export const generateAnalyticsPdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: RangeInput & { label?: string }) =>
    rangeSchema.extend({ label: z.string().max(80).optional() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;

    const [eventsRes, sessionsRes, leadsRes] = await Promise.all([
      db.from("analytics_events").select("event_type,path,target,visitor_id,created_at").gte("created_at", data.start).lte("created_at", data.end).limit(50000),
      db.from("analytics_sessions").select("id,visitor_id,started_at,utm_source,utm_medium,utm_campaign,referrer,user_agent").gte("started_at", data.start).lte("started_at", data.end).limit(50000),
      db.from("analytics_leads").select("*").gte("created_at", data.start).lte("created_at", data.end).order("created_at", { ascending: false }).limit(200),
    ]);

    const events = eventsRes.data ?? [];
    const sessions = sessionsRes.data ?? [];
    const leads = leadsRes.data ?? [];

    const uniqueVisitors = new Set(events.map((e: any) => e.visitor_id)).size;
    const pageViews = events.filter((e: any) => e.event_type === "page_view").length;
    const conversions = events.filter((e: any) => e.event_type === "conversion").length;
    const convRate = uniqueVisitors ? (conversions / uniqueVisitors) * 100 : 0;

    const pageCount = new Map<string, number>();
    events.filter((e: any) => e.event_type === "page_view").forEach((e: any) => {
      pageCount.set(e.path, (pageCount.get(e.path) ?? 0) + 1);
    });
    const topPages = Array.from(pageCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

    const sourceMap = new Map<string, { sessions: number; conversions: number }>();
    for (const s of sessions) {
      const src = s.utm_source || (s.referrer ? (() => { try { return new URL(s.referrer).hostname.replace(/^www\./, ""); } catch { return "direto"; } })() : "direto");
      const key = src || "direto";
      if (!sourceMap.has(key)) sourceMap.set(key, { sessions: 0, conversions: 0 });
      sourceMap.get(key)!.sessions += 1;
    }
    for (const l of leads) {
      const src = l.utm_source || (l.referrer ? (() => { try { return new URL(l.referrer).hostname.replace(/^www\./, ""); } catch { return "direto"; } })() : "direto");
      const key = src || "direto";
      if (!sourceMap.has(key)) sourceMap.set(key, { sessions: 0, conversions: 0 });
      sourceMap.get(key)!.conversions += 1;
    }
    const topSources = Array.from(sourceMap.entries()).sort((a, b) => b[1].sessions - a[1].sessions).slice(0, 10);

    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const RED = rgb(0.85, 0.1, 0.15);
    const BLACK = rgb(0.08, 0.08, 0.09);
    const GREY = rgb(0.42, 0.42, 0.45);
    const LIGHT = rgb(0.95, 0.95, 0.96);

    const PAGE_W = 595.28;
    const PAGE_H = 841.89;
    const M = 48;

    let page = doc.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - M;

    const drawText = (text: string, x: number, yy: number, opts: { size?: number; bold?: boolean; color?: any; maxWidth?: number } = {}) => {
      const size = opts.size ?? 10;
      const f = opts.bold ? fontBold : font;
      let t = text;
      if (opts.maxWidth) {
        while (f.widthOfTextAtSize(t, size) > opts.maxWidth && t.length > 4) t = t.slice(0, -2);
        if (t !== text) t = t.slice(0, -1) + "…";
      }
      page.drawText(t, { x, y: yy, size, font: f, color: opts.color ?? BLACK });
    };

    const drawRect = (x: number, yy: number, w: number, h: number, color: any) => {
      page.drawRectangle({ x, y: yy, width: w, height: h, color });
    };

    const ensureSpace = (needed: number) => {
      if (y - needed < M) {
        page = doc.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - M;
      }
    };

    const fmtDate = (iso: string) => {
      const d = new Date(iso);
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    };

    // === COVER ===
    drawRect(0, PAGE_H - 180, PAGE_W, 180, BLACK);
    drawRect(0, PAGE_H - 184, PAGE_W, 4, RED);
    drawText("RUSSO", M, PAGE_H - 80, { size: 34, bold: true, color: rgb(1, 1, 1) });
    drawText("Elétrica & Ferragens", M, PAGE_H - 105, { size: 12, color: rgb(0.85, 0.85, 0.87) });
    drawText("RELATÓRIO DE PERFORMANCE", M, PAGE_H - 150, { size: 10, bold: true, color: RED });

    y = PAGE_H - 230;
    drawText(data.label ?? "Relatório do período", M, y, { size: 22, bold: true });
    y -= 22;
    drawText(`${fmtDate(data.start)}  a  ${fmtDate(data.end)}`, M, y, { size: 11, color: GREY });
    y -= 34;

    // === KPI GRID ===
    const kpis = [
      { label: "Visitantes únicos", value: String(uniqueVisitors) },
      { label: "Sessões", value: String(sessions.length) },
      { label: "Páginas vistas", value: String(pageViews) },
      { label: "Conversões", value: String(conversions) },
      { label: "Leads registrados", value: String(leads.length) },
      { label: "Taxa de conversão", value: `${convRate.toFixed(2)}%` },
    ];
    const cardW = (PAGE_W - M * 2 - 20) / 3;
    const cardH = 62;
    kpis.forEach((k, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const cx = M + col * (cardW + 10);
      const cy = y - row * (cardH + 10) - cardH;
      drawRect(cx, cy, cardW, cardH, LIGHT);
      drawRect(cx, cy, 3, cardH, RED);
      drawText(k.label.toUpperCase(), cx + 12, cy + cardH - 18, { size: 8, bold: true, color: GREY, maxWidth: cardW - 16 });
      drawText(k.value, cx + 12, cy + 16, { size: 22, bold: true, color: BLACK });
    });
    y -= (cardH + 10) * 2 + 20;

    // === TOP PAGES ===
    const section = (title: string) => {
      ensureSpace(40);
      drawText(title, M, y, { size: 13, bold: true });
      drawRect(M, y - 6, 30, 2, RED);
      y -= 22;
    };

    section("PÁGINAS MAIS VISITADAS");
    const maxPage = topPages[0]?.[1] ?? 1;
    topPages.forEach(([path, count]) => {
      ensureSpace(20);
      drawText(path, M, y, { size: 9, maxWidth: 320 });
      drawText(String(count), PAGE_W - M - 30, y, { size: 9, bold: true });
      const barW = (count / maxPage) * 140;
      drawRect(PAGE_W - M - 180, y - 2, barW, 3, RED);
      y -= 16;
    });
    if (topPages.length === 0) { drawText("Sem dados no período.", M, y, { size: 9, color: GREY }); y -= 16; }
    y -= 14;

    // === TOP SOURCES ===
    section("FONTES DE TRÁFEGO");
    ensureSpace(24);
    drawText("FONTE", M, y, { size: 8, bold: true, color: GREY });
    drawText("SESSÕES", M + 250, y, { size: 8, bold: true, color: GREY });
    drawText("CONVERSÕES", M + 340, y, { size: 8, bold: true, color: GREY });
    y -= 6;
    drawRect(M, y, PAGE_W - M * 2, 0.5, GREY);
    y -= 10;
    topSources.forEach(([src, m]) => {
      ensureSpace(16);
      drawText(src, M, y, { size: 9, maxWidth: 240 });
      drawText(String(m.sessions), M + 250, y, { size: 9 });
      drawText(String(m.conversions), M + 340, y, { size: 9, bold: m.conversions > 0, color: m.conversions > 0 ? RED : BLACK });
      y -= 14;
    });
    if (topSources.length === 0) { drawText("Sem dados no período.", M, y, { size: 9, color: GREY }); y -= 16; }
    y -= 14;

    // === LEADS TABLE ===
    section("LEADS RECENTES");
    ensureSpace(24);
    drawText("DATA", M, y, { size: 8, bold: true, color: GREY });
    drawText("ORIGEM", M + 90, y, { size: 8, bold: true, color: GREY });
    drawText("CAMPANHA", M + 220, y, { size: 8, bold: true, color: GREY });
    drawText("EVENTO", M + 340, y, { size: 8, bold: true, color: GREY });
    drawText("PÁGINA", M + 420, y, { size: 8, bold: true, color: GREY });
    y -= 6;
    drawRect(M, y, PAGE_W - M * 2, 0.5, GREY);
    y -= 10;
    leads.slice(0, 60).forEach((l: any) => {
      ensureSpace(16);
      drawText(fmtDate(l.created_at), M, y, { size: 8, maxWidth: 80 });
      drawText(l.utm_source || "direto", M + 90, y, { size: 8, maxWidth: 120 });
      drawText(l.utm_campaign || ",", M + 220, y, { size: 8, maxWidth: 110 });
      drawText(l.source_event, M + 340, y, { size: 8, bold: true, color: RED, maxWidth: 70 });
      drawText(l.path || ",", M + 420, y, { size: 8, maxWidth: 130 });
      y -= 13;
    });
    if (leads.length === 0) { drawText("Nenhuma conversão no período.", M, y, { size: 9, color: GREY }); y -= 16; }

    // Footer on every page
    const pageCountAll = doc.getPageCount();
    for (let i = 0; i < pageCountAll; i++) {
      const p = doc.getPage(i);
      p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 24, color: BLACK });
      p.drawText(`Russo Elétrica & Ferragens  ·  Relatório interno  ·  ${fmtDate(new Date().toISOString())}`, {
        x: M, y: 8, size: 8, font, color: rgb(0.85, 0.85, 0.87),
      });
      p.drawText(`${i + 1} / ${pageCountAll}`, { x: PAGE_W - M - 20, y: 8, size: 8, font: fontBold, color: rgb(1, 1, 1) });
    }

    const bytes = await doc.save();
    // Return base64 for the client to trigger a download.
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const base64 = typeof btoa !== "undefined" ? btoa(bin) : Buffer.from(bytes).toString("base64");
    return { base64, filename: `russo-analytics-${data.start.slice(0, 10)}-${data.end.slice(0, 10)}.pdf` };
  });