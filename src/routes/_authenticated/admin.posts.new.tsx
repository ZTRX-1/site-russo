import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/PostForm";

export const Route = createFileRoute("/_authenticated/admin/posts/new")({
  component: NewPost,
});

function NewPost() {
  return (
    <div className="space-y-6">
      <Link to="/admin/posts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="font-display text-3xl font-black">Novo post</h1>
      <PostForm
        initial={{
          title: "",
          slug: "",
          description: "",
          content_html: "",
          category: "Elétrica",
          cover_url: "",
          status: "draft",
        }}
      />
    </div>
  );
}