import { useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RichTextEditor } from "./RichTextEditor";
import { createPost, updatePost, deletePost } from "@/lib/posts.functions";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";

const BLOG_MEDIA_BUCKET = "blog-media";

function toLocalInput(iso: string) {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return ""; }
}

interface Post {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content_html: string;
  category: string;
  cover_url: string | null;
  status: "draft" | "published";
  published_at?: string | null;
}

export function PostForm({ initial }: { initial: Post }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Post>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!form.id;

  function invalidatePostCaches(postId?: string) {
    queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
    queryClient.invalidateQueries({ queryKey: ["published-posts"] });
    if (postId) queryClient.invalidateQueries({ queryKey: ["admin-post", postId] });
  }

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo: 5MB.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `covers/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BLOG_MEDIA_BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (upErr) throw upErr;
      const { data: publicUrl } = supabase.storage.from(BLOG_MEDIA_BUCKET).getPublicUrl(path);
      setForm({ ...form, cover_url: publicUrl.publicUrl });
      toast.success("Capa enviada!");
    } catch (e) {
      toast.error("Falha no upload: " + (e as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function save(status: "draft" | "published") {
    if (!form.title.trim()) {
      toast.error("Título é obrigatório.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, status };
      if (isEdit && form.id) {
        await updatePost({ ...payload, id: form.id });
        toast.success(status === "published" ? "Post publicado!" : "Rascunho salvo.");
        setForm({ ...form, status });
        invalidatePostCaches(form.id);
      } else {
        const created = await createPost(payload);
        toast.success(status === "published" ? "Post publicado!" : "Rascunho salvo.");
        invalidatePostCaches(created.id);
        navigate({ to: "/admin/posts/$id", params: { id: created.id } });
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!form.id || !confirm("Apagar este post? Não pode ser desfeito.")) return;
    try {
      await deletePost({ id: form.id });
      toast.success("Post apagado.");
      invalidatePostCaches(form.id);
      navigate({ to: "/admin/posts" });
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Título</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-lg font-semibold outline-none focus:border-primary"
            placeholder="Como escolher o disjuntor certo..."
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug (URL)</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="deixe em branco para gerar do título"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categoria</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Data de publicação
          </label>
          <input
            type="datetime-local"
            value={form.published_at ? toLocalInput(form.published_at) : ""}
            onChange={(e) =>
              setForm({
                ...form,
                published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
              })
            }
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary sm:w-72"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Deixe em branco para usar a data atual no momento da publicação.
          </p>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resumo (aparece na listagem e no Google)</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            maxLength={500}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Imagem de capa
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
            {form.cover_url ? (
              <div className="relative w-full overflow-hidden rounded-md border border-border sm:w-64">
                <img src={form.cover_url} alt="Capa" className="aspect-[16/9] w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, cover_url: null })}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                  aria-label="Remover capa"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-background/50 text-sm text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-60 sm:w-64"
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-6 w-6" />
                    <span>Enviar imagem</span>
                    <span className="text-[10px] uppercase tracking-wider">JPG, PNG · até 5MB</span>
                  </>
                )}
              </button>
            )}
            <div className="flex flex-1 flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                }}
              />
              {form.cover_url && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 self-start rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-60"
                >
                  {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  Substituir imagem
                </button>
              )}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Ou cole uma URL
                </label>
                <input
                  type="url"
                  value={form.cover_url ?? ""}
                  onChange={(e) => setForm({ ...form, cover_url: e.target.value || null })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conteúdo</label>
        <div className="mt-1">
          <RichTextEditor
            value={form.content_html}
            onChange={(html) => setForm({ ...form, content_html: html })}
          />
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background/90 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-md sm:border sm:px-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={`inline-flex h-2 w-2 rounded-full ${form.status === "published" ? "bg-green-500" : "bg-yellow-500"}`} />
          {form.status === "published" ? "Publicado" : "Rascunho"}
        </div>
        <div className="flex flex-wrap gap-2">
          {isEdit && (
            <button
              type="button" onClick={onDelete}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
            >Apagar</button>
          )}
          <button
            type="button" disabled={saving} onClick={() => save("draft")}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-60"
          >Salvar rascunho</button>
          <button
            type="button" disabled={saving} onClick={() => save("published")}
            className="rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-60"
          >Publicar</button>
        </div>
      </div>
    </div>
  );
}