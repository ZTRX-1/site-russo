import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/atendimento-condominios")({
  beforeLoad: () => {
    throw redirect({ to: "/condominios", statusCode: 301 });
  },
});