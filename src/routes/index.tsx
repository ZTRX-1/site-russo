import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { FloatingWhats } from "@/components/shared/FloatingWhats";

import { Hero } from "@/components/home/Hero";
import { ClientesParceiros } from "@/components/home/ClientesParceiros";
import { QuickQuote } from "@/components/home/QuickQuote";
import { Categorias } from "@/components/home/Categorias";
import { Diferenciais } from "@/components/home/Diferenciais";
import { Atendemos } from "@/components/home/Atendemos";
import { OrcamentoCorporativo } from "@/components/home/OrcamentoCorporativo";
import { Avaliacoes } from "@/components/home/Avaliacoes";
import { Sobre } from "@/components/home/Sobre";
import { Localizacao } from "@/components/home/Localizacao";
import { Contato } from "@/components/home/Contato";
import { CtaBar } from "@/components/home/CtaBar";

import {
  WHATSAPP_URL_ESPECIALISTA,
  SITE_URL,
  COMPANY_NAME,
  GOOGLE_MAPS_URL,
} from "@/lib/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=5",
      },
      {
        title:
          "Russo Elétrica e Ferragens | Materiais Elétricos no Rio Pequeno - Zona Oeste SP",
      },
      {
        name: "description",
        content:
          "Loja de materiais elétricos, ferragens, hidráulica e iluminação no Rio Pequeno, Zona Oeste de SP. Atendimento para eletricistas, empresas e condomínios próximo à USP, Butantã e Jaguaré. Solicite seu orçamento pelo WhatsApp.",
      },
      {
        name: "keywords",
        content:
          "material elétrico Rio Pequeno, loja de elétrica Zona Oeste SP, ferragens Rio Pequeno, materiais elétricos Butantã, loja de ferragens Jaguaré, iluminação Zona Oeste, fios e cabos São Paulo, hidráulica Rio Pequeno, eletricista Zona Oeste, material elétrico USP, material elétrico Raposo Tavares, material elétrico Vila São Francisco, fornecedor material elétrico condomínios, orçamento elétrica empresa SP, fornecedor B2B elétrica, Av. Escola Politécnica",
      },
      {
        property: "og:title",
        content: "Russo Elétrica e Ferragens — Materiais Elétricos no Rio Pequeno, Zona Oeste SP",
      },
      {
        property: "og:description",
        content:
          "Soluções completas em elétrica, ferragens, hidráulica e iluminação. Para consumidores, eletricistas, empresas e condomínios na Zona Oeste de São Paulo.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/" },
      {
        property: "og:image",
        content: SITE_URL + "/uploads/qqqq.jpg",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Fachada da Russo Elétrica e Ferragens no Rio Pequeno, Zona Oeste de São Paulo" },
      { name: "twitter:title", content: "Russo Elétrica e Ferragens — Rio Pequeno, Zona Oeste SP" },
      { name: "twitter:description", content: "Materiais elétricos, ferragens, hidráulica e iluminação na Zona Oeste de SP. Atendimento para eletricistas, empresas e condomínios." },
      { name: "twitter:image", content: SITE_URL + "/uploads/qqqq.jpg" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["HardwareStore", "LocalBusiness"],
          "@id": SITE_URL + "/#localbusiness",
          name: COMPANY_NAME,
          alternateName: "Russo Eletro Ferragens",
          url: SITE_URL,
          image: [SITE_URL + "/uploads/qqqq.jpg", SITE_URL + "/uploads/fachada-russo.png"],
          logo: SITE_URL + "/uploads/logo-russo.png",
          telephone: "+551137662002",
          email: "contato@russoeletrofer.com.br",
          priceRange: "$$",
          currenciesAccepted: "BRL",
          paymentAccepted: "Cash, Credit Card, Debit Card, Pix",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Escola Politécnica, 2850",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            postalCode: "05386-130",
            addressCountry: "BR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -23.56133,
            longitude: -46.74526,
          },
          hasMap: GOOGLE_MAPS_URL,
          areaServed: [
            { "@type": "Place", name: "Rio Pequeno" },
            { "@type": "Place", name: "Butantã" },
            { "@type": "Place", name: "Jaguaré" },
            { "@type": "Place", name: "Vila Sônia" },
            { "@type": "Place", name: "Morumbi" },
            { "@type": "Place", name: "Lapa" },
            { "@type": "Place", name: "Osasco" },
            { "@type": "Place", name: "Zona Oeste de São Paulo" },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5.0",
            reviewCount: "127",
          },
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "13:00" },
          ],
          sameAs: [
            "https://www.instagram.com/russoeletrica/",
            "https://www.facebook.com/russoeletrica/",
          ],
          makesOffer: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Materiais Elétricos" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ferragens e Ferramentas" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Iluminação Residencial e Comercial" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Materiais Hidráulicos" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Atendimento para Condomínios e Empresas" } },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": SITE_URL + "/#website",
          url: SITE_URL,
          name: COMPANY_NAME,
          inLanguage: "pt-BR",
          publisher: { "@id": SITE_URL + "/#organization" },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        if (window.scrollY > 20) document.body.classList.add("scrolled");
        else document.body.classList.remove("scrolled");
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-16 text-foreground sm:pb-0">
      <Header />
      <main>
        <Hero />
        <ClientesParceiros />
        <QuickQuote />
        <Categorias />
        <Diferenciais />
        <Atendemos />
        <OrcamentoCorporativo />
        <CtaBar
          eyebrow="Atendimento técnico"
          title="Fale agora com um especialista da Russo"
          description="Tire dúvidas técnicas antes de comprar — nossa equipe orienta o material certo para o seu projeto. Atendimento durante o horário comercial."
          href={WHATSAPP_URL_ESPECIALISTA}
          cta="Falar com especialista"
          variant="light"
        />
        <Avaliacoes />
        <Sobre />
        <Localizacao />
        <Contato />
      </main>
      <Footer />
      <FloatingWhats />
      <MobileCtaBar />
    </div>
  );
}
