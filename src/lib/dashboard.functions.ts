import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function pct(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function classifySource(utmSource: string | null, referrer: string | null): "ads" | "organic" | "direct" | "referral" {
  const u = (utmSource || "").toLowerCase();
  if (u.includes("google") && (u.includes("cpc") || u.includes("ads") || u.includes("paid"))) return "ads";
  if (u === "google" || u === "bing" || u === "yahoo" || u === "duckduckgo") return "organic";
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes("google") || host.includes("bing") || host.includes("yahoo") || host.includes("duckduckgo")) return "organic";
    if (host.includes("doubleclick") || host.includes("googleads") || host.includes("googlesyndication")) return "ads";
    return "referral";
  } catch {
    return "direct";
  }
}

export const getDashboardOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Acesso restrito a administradores.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;

    const now = new Date().toISOString();
    const start7 = daysAgoISO(7);
    const start14 = daysAgoISO(14);
    const start30 = daysAgoISO(30);
    const start60 = daysAgoISO(60);
    const start90 = daysAgoISO(90);
    const start180 = daysAgoISO(180);
    const start24h = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const start30min = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const [eventsRes, sessionsRes, postsRes, leadsRes] = await Promise.all([
      db.from("analytics_events")
        .select("event_type,path,target,visitor_id,session_id,created_at,title")
        .gte("created_at", start180)
        .lte("created_at", now)
        .order("created_at", { ascending: false })
        .limit(50000),
      db.from("analytics_sessions")
        .select("id,visitor_id,started_at,referrer,utm_source,utm_medium,utm_campaign,landing_path")
        .gte("started_at", start180)
        .lte("started_at", now)
        .limit(50000),
      db.from("posts").select("id,title,slug,status,published_at,cover_url,category,updated_at"),
      db.from("analytics_leads").select("id,created_at,source_event,path")
        .gte("created_at", start90)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    const events = eventsRes.data ?? [];
    const sessions = sessionsRes.data ?? [];
    const posts = postsRes.data ?? [];
    const leads = leadsRes.data ?? [];

    // KPIs por janela
    function agg(startISO: string, endISO: string) {
      const inWindow = (ts: string) => ts >= startISO && ts <= endISO;
      const ev = events.filter((e: any) => inWindow(e.created_at));
      const s = sessions.filter((x: any) => inWindow(x.started_at));
      const uniq = new Set(ev.map((e: any) => e.visitor_id)).size;
      const pv = ev.filter((e: any) => e.event_type === "page_view").length;
      const wa = ev.filter((e: any) => e.event_type === "click" || e.event_type === "conversion")
        .filter((e: any) => (e.target || "").toLowerCase().includes("whatsapp")).length;
      const conv = ev.filter((e: any) => e.event_type === "conversion").length;
      return { visitors: uniq, sessions: s.length, pageViews: pv, whatsappClicks: wa, conversions: conv };
    }

    const w7 = agg(start7, now);
    const w7prev = agg(start14, start7);
    const w30 = agg(start30, now);
    const w30prev = agg(start60, start30);
    const w90 = agg(start90, now);
    const w90prev = agg(start180, start90);

    // Usuários ativos (últimos 30 min)
    const activeNow = new Set(
      events.filter((e: any) => e.created_at >= start30min).map((e: any) => e.visitor_id),
    ).size;

    // Origem de tráfego (últimos 30 dias)
    const sources = { ads: 0, organic: 0, direct: 0, referral: 0 };
    for (const s of sessions.filter((x: any) => x.started_at >= start30)) {
      sources[classifySource(s.utm_source, s.referrer)] += 1;
    }

    // Timeseries (últimos 30 dias)
    const dayMap = new Map<string, { date: string; visitors: Set<string>; sessions: number; pageViews: number }>();
    const trimmed30 = events.filter((e: any) => e.created_at >= start30);
    for (const e of trimmed30) {
      const d = e.created_at.slice(0, 10);
      if (!dayMap.has(d)) dayMap.set(d, { date: d, visitors: new Set(), sessions: 0, pageViews: 0 });
      const row = dayMap.get(d)!;
      row.visitors.add(e.visitor_id);
      if (e.event_type === "page_view") row.pageViews += 1;
    }
    for (const s of sessions.filter((x: any) => x.started_at >= start30)) {
      const d = s.started_at.slice(0, 10);
      if (!dayMap.has(d)) dayMap.set(d, { date: d, visitors: new Set(), sessions: 0, pageViews: 0 });
      dayMap.get(d)!.sessions += 1;
    }
    const timeseries = Array.from(dayMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => ({ date: r.date, visitors: r.visitors.size, sessions: r.sessions, pageViews: r.pageViews }));

    // Visualizações de artigos (page_view em /blog/*, últimos 30d)
    const blogViews = trimmed30.filter((e: any) => e.event_type === "page_view" && (e.path || "").startsWith("/blog/")).length;
    const blogViewsPrev = events.filter((e: any) =>
      e.created_at >= start60 && e.created_at < start30 &&
      e.event_type === "page_view" && (e.path || "").startsWith("/blog/")
    ).length;

    // Top artigos por pageviews (últimos 90d)
    const articleCount = new Map<string, number>();
    events.filter((e: any) => e.created_at >= start90 && e.event_type === "page_view" && (e.path || "").startsWith("/blog/"))
      .forEach((e: any) => articleCount.set(e.path, (articleCount.get(e.path) ?? 0) + 1));
    const topArticles = Array.from(articleCount.entries())
      .map(([path, views]) => {
        const slug = path.replace(/^\/blog\//, "").replace(/\/$/, "");
        const post = posts.find((p: any) => p.slug === slug);
        return { path, slug, title: post?.title ?? slug, views };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);

    // Últimos acessos
    const recentPageviews = events
      .filter((e: any) => e.event_type === "page_view")
      .slice(0, 8)
      .map((e: any) => ({ path: e.path, title: e.title, when: e.created_at }));

    return {
      generatedAt: now,
      activeNow,
      windows: {
        d7: { current: w7, previous: w7prev, deltaVisitors: pct(w7.visitors, w7prev.visitors), deltaPageViews: pct(w7.pageViews, w7prev.pageViews), deltaWhatsApp: pct(w7.whatsappClicks, w7prev.whatsappClicks) },
        d30: { current: w30, previous: w30prev, deltaVisitors: pct(w30.visitors, w30prev.visitors), deltaPageViews: pct(w30.pageViews, w30prev.pageViews), deltaWhatsApp: pct(w30.whatsappClicks, w30prev.whatsappClicks) },
        d90: { current: w90, previous: w90prev, deltaVisitors: pct(w90.visitors, w90prev.visitors), deltaPageViews: pct(w90.pageViews, w90prev.pageViews), deltaWhatsApp: pct(w90.whatsappClicks, w90prev.whatsappClicks) },
      },
      sources,
      timeseries,
      posts: {
        published: posts.filter((p: any) => p.status === "published").length,
        drafts: posts.filter((p: any) => p.status !== "published").length,
        total: posts.length,
        blogViews30d: blogViews,
        deltaBlogViews: pct(blogViews, blogViewsPrev),
        recent: posts
          .slice()
          .sort((a: any, b: any) => (b.updated_at || "").localeCompare(a.updated_at || ""))
          .slice(0, 5)
          .map((p: any) => ({ id: p.id, title: p.title, slug: p.slug, status: p.status, cover_url: p.cover_url })),
        topArticles,
      },
      leads: {
        total90d: leads.length,
        recent: leads.slice(0, 5),
      },
      recentPageviews,
    };
  });