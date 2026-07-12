import { Outlet, createFileRoute } from "@tanstack/react-router";

// Layout do blog — permite /blog/:slug renderizar dentro da árvore /blog.
export const Route = createFileRoute("/blog")({
  component: () => <Outlet />,
});