import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CookieConsent } from "../components/shared/CookieConsent";
import {
  GoogleTagManagerHead,
  GoogleTagManagerBody,
} from "../components/analytics/GoogleTagManager";
import { trackPageView } from "../lib/analytics";

const GSC_TOKEN = import.meta.env.VITE_GSC_VERIFICATION as string | undefined;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Russo Elétrica e Ferragens | Materiais Elétricos no Rio Pequeno" },
      { name: "description", content: "Loja de materiais elétricos e ferragens no Rio Pequeno, Zona Oeste de São Paulo. Atendimento para empresas, condomínios, eletricistas e consumidores, com grande variedade em estoque, emissão de nota fiscal e fácil acesso pela Av. Escola Politécnica." },
      { name: "author", content: "Russo Elétrica e Ferragens" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "theme-color", content: "#0F172A" },
      { name: "geo.region", content: "BR-SP" },
      { name: "geo.placename", content: "São Paulo - Rio Pequeno" },
      { name: "geo.position", content: "-23.56133;-46.74526" },
      { name: "ICBM", content: "-23.56133, -46.74526" },
      { property: "og:site_name", content: "Russo Elétrica e Ferragens" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: "Loja de materiais elétricos e ferragens no Rio Pequeno, Zona Oeste de São Paulo. Atendimento para empresas, condomínios, eletricistas e consumidores, com grande variedade em estoque, emissão de nota fiscal e fácil acesso pela Av. Escola Politécnica." },
      { name: "twitter:description", content: "Loja de materiais elétricos e ferragens no Rio Pequeno, Zona Oeste de São Paulo. Atendimento para empresas, condomínios, eletricistas e consumidores." },
      ...(GSC_TOKEN ? [{ name: "google-site-verification", content: GSC_TOKEN }] : []),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://www.google.com" },
      { rel: "dns-prefetch", href: "https://maps.googleapis.com" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://russoeletrofer.com.br/#organization",
          name: "Russo Elétrica e Ferragens",
          url: "https://russoeletrofer.com.br",
          logo: "https://russoeletrofer.com.br/uploads/logo-russo.png",
          image: "https://russoeletrofer.com.br/uploads/fachada.webp",
          telephone: "+551137662002",
          email: "contato@russoeletrofer.com.br",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Escola Politécnica, 2850",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            postalCode: "05386-130",
            addressCountry: "BR",
          },
          areaServed: ["Rio Pequeno", "Butantã", "Jaguaré", "Vila Sônia", "Morumbi", "Lapa", "Osasco", "Raposo Tavares", "Vila São Francisco", "USP", "Zona Oeste de São Paulo"],
          sameAs: [
            "https://www.instagram.com/russoeletrica/",
            "https://www.facebook.com/russoeletrica/",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* GA4/Ads são carregados via container do GTM para evitar hits duplicados. */}
        <GoogleTagManagerHead />
        <HeadContent />
      </head>
      <body>
        <GoogleTagManagerBody />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    // Dispara page_view em cada mudança de rota (SPA)
    const unsub = router.subscribe("onResolved", ({ toLocation }) => {
      trackPageView(toLocation.pathname);
    });
    // Primeira carga
    trackPageView(window.location.pathname);
    return () => unsub();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <CookieConsent />
    </QueryClientProvider>
  );
}
