import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/constants";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/empresas", changefreq: "monthly", priority: "0.9" },
          { path: "/condominios", changefreq: "monthly", priority: "0.9" },
          { path: "/rio-pequeno", changefreq: "monthly", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.3" },
          { path: "/termos-de-uso", changefreq: "yearly", priority: "0.3" },
          { path: "/lgpd", changefreq: "yearly", priority: "0.3" },
          { path: "/cdc", changefreq: "yearly", priority: "0.3" },
        ];
        try {
          const url = process.env.SUPABASE_URL;
          const key = process.env.SUPABASE_PUBLISHABLE_KEY;
          if (url && key) {
            const sb = createClient(url, key, {
              auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
              global: {
                fetch: (input, init) => {
                  const h = new Headers(init?.headers);
                  if ((key.startsWith("sb_publishable_") || key.startsWith("sb_secret_")) && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
                  h.set("apikey", key);
                  return fetch(input, { ...init, headers: h });
                },
              },
            });
            const { data } = await sb.from("posts").select("slug").eq("status", "published");
            for (const p of data ?? []) {
              entries.push({ path: `/blog/${p.slug}`, changefreq: "monthly", priority: "0.7" });
            }
          }
        } catch {
          // sitemap sem posts é aceitável
        }
        const today = new Date().toISOString().split("T")[0];
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${SITE_URL}${e.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});