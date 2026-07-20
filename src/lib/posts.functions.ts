import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

const postSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(0).max(200).optional(),
  description: z.string().max(500).default(""),
  content_html: z.string().max(200_000).default(""),
  category: z.string().min(1).max(80).default("Geral"),
  cover_url: z.string().max(1000).optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  published_at: z.string().datetime().optional().nullable(),
});

type PostInput = z.infer<typeof postSchema>;

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Sessão expirada. Entre novamente.");
  return data.user;
}

export async function listAdminPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, status, category, author_name, published_at, updated_at, cover_url")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminPost(input: { id: string } | { data: { id: string } }) {
  const id = "data" in input ? input.data.id : input.id;
  const { data: post, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!post) throw new Error("Post não encontrado.");
  return post;
}

export async function createPost(input: PostInput | { data: PostInput }) {
  const raw = "data" in input ? input.data : input;
  const data = postSchema.parse(raw);
  const user = await getCurrentUser();
  const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email")
    .eq("id", user.id)
    .maybeSingle();
  const authorName = profile?.display_name || profile?.email || "Equipe Russo";
  const publishedAt = data.status === "published" ? data.published_at || new Date().toISOString() : data.published_at || null;

  const { data: created, error } = await supabase
    .from("posts")
    .insert({
      title: data.title,
      slug,
      description: data.description,
      content_html: data.content_html,
      category: data.category,
      cover_url: data.cover_url || null,
      status: data.status,
      author_id: user.id,
      author_name: authorName,
      published_at: publishedAt,
    })
    .select("id, slug")
    .single();
  if (error) throw new Error(error.message);
  return created;
}

export async function updatePost(input: (PostInput & { id: string }) | { data: PostInput & { id: string } }) {
  const raw = "data" in input ? input.data : input;
  const data = postSchema.extend({ id: z.string().uuid() }).parse(raw);
  const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
  const { data: existing } = await supabase.from("posts").select("status, published_at").eq("id", data.id).maybeSingle();
  const publishedAt = data.status === "published" ? data.published_at || existing?.published_at || new Date().toISOString() : data.published_at || null;
  const { error } = await supabase
    .from("posts")
    .update({
      title: data.title,
      slug,
      description: data.description,
      content_html: data.content_html,
      category: data.category,
      cover_url: data.cover_url || null,
      status: data.status,
      published_at: publishedAt,
    })
    .eq("id", data.id);
  if (error) throw new Error(error.message);
  return { ok: true, slug };
}

export async function deletePost(input: { id: string } | { data: { id: string } }) {
  const id = "data" in input ? input.data.id : input.id;
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}