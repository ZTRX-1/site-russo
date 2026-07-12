import { createFileRoute, redirect } from "@tanstack/react-router";

// URL antiga — redirect permanente para /empresas (preserva SEO).
export const Route = createFileRoute("/atendimento-empresas")({
  beforeLoad: () => {
    throw redirect({ to: "/empresas", statusCode: 301 });
  },
});