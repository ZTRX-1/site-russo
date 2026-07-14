import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

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
  slug: z.string().min(3).max(200).optional(),
  description: z.string().max(500).default(""),
  content_html: z.string().max(200_000).default(""),
  category: z.string().min(1).max(80).default("Geral"),
  cover_url: z.string().url().max(1000).optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const listAdminPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("posts")
      .select("id, slug, title, status, category, author_name, published_at, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAdminPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: post, error } = await context.supabase
      .from("posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) throw new Error("Post não encontrado.");
    return post;
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => postSchema.parse(input))
  .handler(async ({ data, context }) => {
    const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("display_name, email")
      .eq("id", context.userId)
      .maybeSingle();
    const authorName = profile?.display_name || profile?.email || "Equipe Russo";
    const publishedAt = data.status === "published" ? new Date().toISOString() : null;
    const { data: created, error } = await context.supabase
      .from("posts")
      .insert({
        title: data.title,
        slug,
        description: data.description,
        content_html: data.content_html,
        category: data.category,
        cover_url: data.cover_url || null,
        status: data.status,
        author_id: context.userId,
        author_name: authorName,
        published_at: publishedAt,
      })
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);
    return created;
  });

export const updatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    postSchema.extend({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
    // preservar published_at se já publicado
    const { data: existing } = await context.supabase
      .from("posts")
      .select("status, published_at")
      .eq("id", data.id)
      .maybeSingle();
    const publishedAt =
      data.status === "published"
        ? existing?.published_at ?? new Date().toISOString()
        : null;
    const { error } = await context.supabase
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
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });