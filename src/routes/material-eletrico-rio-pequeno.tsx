import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/material-eletrico-rio-pequeno")({
  beforeLoad: () => {
    throw redirect({ to: "/rio-pequeno", statusCode: 301 });
  },
});