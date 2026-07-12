/**
 * GA4 direto (opcional — só usado se você preferir GA sem GTM).
 * Se você já usa GTM com tag de GA4 dentro, pode deixar VITE_GA_ID vazio.
 */
const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`,
        }}
      />
    </>
  );
}