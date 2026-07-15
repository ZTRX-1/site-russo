/**
 * GA4 direto (opcional — só usado se você preferir GA sem GTM).
 * Se você já usa GTM com tag de GA4 dentro, pode deixar VITE_GA_ID vazio.
 */
const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const GOOGLE_ADS_ID = "AW-18323605484";

export function GoogleAnalytics() {
  const primaryId = GA_ID || GOOGLE_ADS_ID;
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${GA_ID ? `gtag('config','${GA_ID}',{send_page_view:false});` : ""}gtag('config','${GOOGLE_ADS_ID}');`,
        }}
      />
    </>
  );
}