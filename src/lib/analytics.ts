/**
 * Camada única de analytics. Segue rodando mesmo sem GTM/GA carregado —
 * eventos são empilhados em window.dataLayer e serão consumidos assim
 * que o Google Tag Manager entrar em ação.
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    __russoVisitorId?: string;
    __russoSessionId?: string;
  }
}

type TrackingPayload = {
  event_type: "page_view" | "click" | "conversion";
  path: string;
  target?: string;
  title?: string;
  meta?: Record<string, unknown>;
};

const getLayer = () => {
  if (typeof window === "undefined") return null;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  const layer = getLayer();
  if (!layer) return;
  layer.push({ event: name, ...params });
  sendFirstPartyEvent({
    event_type: name.includes("whatsapp") || name.includes("form") ? "conversion" : "click",
    path: window.location.pathname,
    target: name,
    meta: params,
  });
}

export function trackWhatsAppClick(source: string, extra: Record<string, unknown> = {}) {
  trackEvent("whatsapp_click", { source, ...extra });
}

export function trackPageView(path: string, title?: string) {
  const layer = getLayer();
  if (!layer) return;
  layer.push({
    event: "page_view",
    page_path: path,
    page_title: title ?? (typeof document !== "undefined" ? document.title : ""),
  });
  // GA4 direct (quando gtag existir)
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title,
    });
  }
  sendFirstPartyEvent({ event_type: "page_view", path, title: title ?? document.title });
}

/** Consent Mode v2 — chamado pelo CookieConsent quando o usuário decide */
export function setConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const state = granted ? "granted" : "denied";
  window.dataLayer.push({
    event: "consent_update",
    consent: {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    },
  });
  window.localStorage.setItem("russo_cookie_consent", granted ? "granted" : "denied");
}

function getOrCreateId(storage: Storage | null, key: string) {
  if (!storage) return crypto.randomUUID();
  const existing = storage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID();
  storage.setItem(key, next);
  return next;
}

function collectAttribution() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  return {
    referrer: document.referrer || null,
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
    gclid: params.get("gclid"),
    fbclid: params.get("fbclid"),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    user_agent: navigator.userAgent,
  };
}

function sendFirstPartyEvent(payload: TrackingPayload) {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  // Não registrar tráfego de ambientes de desenvolvimento/preview.
  const host = window.location.hostname.toLowerCase();
  const isDevHost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".lovable.dev") ||
    host.endsWith(".lovableproject.com") ||
    /(^|\.)preview--/.test(host) ||
    /(^|\.)id-preview--/.test(host);
  if (isDevHost) return;

  const consent = window.localStorage.getItem("russo_cookie_consent");
  const canPersist = consent === "granted";
  const visitorId = canPersist
    ? (window.__russoVisitorId ??= getOrCreateId(window.localStorage, "russo_visitor_id"))
    : crypto.randomUUID();
  const sessionId = (window.__russoSessionId ??= getOrCreateId(window.sessionStorage, "russo_session_id"));

  const body = JSON.stringify({
    visitor_id: visitorId,
    session_id: sessionId,
    ...payload,
    meta: { ...collectAttribution(), ...(payload.meta ?? {}) },
  });

  const blob = new Blob([body], { type: "application/json" });
  if (navigator.sendBeacon?.("/api/public/track", blob)) return;

  fetch("/api/public/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Tracking nunca deve interferir na navegação do visitante.
  });
}