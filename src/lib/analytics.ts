/**
 * Camada única de analytics. Segue rodando mesmo sem GTM/GA carregado —
 * eventos são empilhados em window.dataLayer e serão consumidos assim
 * que o Google Tag Manager entrar em ação.
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const getLayer = () => {
  if (typeof window === "undefined") return null;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  const layer = getLayer();
  if (!layer) return;
  layer.push({ event: name, ...params });
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
}