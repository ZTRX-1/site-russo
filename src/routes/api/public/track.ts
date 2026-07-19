import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.object({
  visitor_id: z.string().uuid(),
  session_id: z.string().uuid(),
  event_type: z.enum(["page_view", "click", "conversion"]),
  path: z.string().max(1000),
  target: z.string().max(200).optional(),
  title: z.string().max(300).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: z.infer<typeof payloadSchema>;
        try {
          payload = payloadSchema.parse(await request.json());
        } catch {
          return Response.json({ ok: false }, { status: 400 });
        }

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const now = new Date().toISOString();
          const country = request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country");
          const city = request.headers.get("x-vercel-ip-city");
          const userAgent = typeof payload.meta?.user_agent === "string" ? payload.meta.user_agent : null;
          const referrer = typeof payload.meta?.referrer === "string" ? payload.meta.referrer : null;
          const utm_source = typeof payload.meta?.utm_source === "string" ? payload.meta.utm_source : null;
          const utm_medium = typeof payload.meta?.utm_medium === "string" ? payload.meta.utm_medium : null;
          const utm_campaign = typeof payload.meta?.utm_campaign === "string" ? payload.meta.utm_campaign : null;
          const utm_term = typeof payload.meta?.utm_term === "string" ? payload.meta.utm_term : null;
          const utm_content = typeof payload.meta?.utm_content === "string" ? payload.meta.utm_content : null;
          const gclid = typeof payload.meta?.gclid === "string" ? payload.meta.gclid : null;
          const fbclid = typeof payload.meta?.fbclid === "string" ? payload.meta.fbclid : null;

          await supabaseAdmin.from("analytics_visitors").upsert(
            {
              id: payload.visitor_id,
              first_seen_at: now,
              last_seen_at: now,
              first_referrer: referrer,
              first_utm_source: utm_source,
              first_utm_medium: utm_medium,
              first_utm_campaign: utm_campaign,
              country,
              city,
            },
            { onConflict: "id", ignoreDuplicates: false },
          );

          await supabaseAdmin.from("analytics_sessions").upsert(
            {
              id: payload.session_id,
              visitor_id: payload.visitor_id,
              started_at: now,
              last_seen_at: now,
              landing_path: payload.path,
              referrer,
              utm_source,
              utm_medium,
              utm_campaign,
              utm_term,
              utm_content,
              gclid,
              fbclid,
              user_agent: userAgent,
            },
            { onConflict: "id", ignoreDuplicates: false },
          );

          await supabaseAdmin.from("analytics_events").insert({
            visitor_id: payload.visitor_id,
            session_id: payload.session_id,
            event_type: payload.event_type,
            path: payload.path,
            target: payload.target ?? null,
            title: payload.title ?? null,
            meta: payload.meta ?? {},
          });

          if (payload.event_type === "conversion") {
            await supabaseAdmin.from("analytics_leads").insert({
              visitor_id: payload.visitor_id,
              session_id: payload.session_id,
              source_event: payload.target ?? "conversion",
              path: payload.path,
              referrer,
              utm_source,
              utm_medium,
              utm_campaign,
              utm_term,
              utm_content,
              gclid,
              fbclid,
              meta: payload.meta ?? {},
            });
          }
        } catch (error) {
          console.warn("[track] analytics write skipped", error);
        }

        return Response.json({ ok: true });
      },
      OPTIONS: async () => new Response(null, { status: 204 }),
    },
  },
});