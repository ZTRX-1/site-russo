/**
 * Google Tag Manager, carrega apenas se VITE_GTM_ID estiver definido.
 * Enquanto vazio, o site fica limpo (zero requisições ao Google).
 */
const GTM_ID = (import.meta.env.VITE_GTM_ID as string | undefined) || "GTM-5DH6MZ8F";

export function GoogleTagManagerHead() {
  if (!GTM_ID) return null;
  const script = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
// Consent Mode v2, default denied (LGPD)
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export function GoogleTagManagerBody() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="gtm"
      />
    </noscript>
  );
}