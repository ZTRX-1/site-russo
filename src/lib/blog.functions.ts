import { supabase } from "@/integrations/supabase/client";

export async function listPublishedPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, description, category, cover_url, author_name, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { posts: data ?? [], error: null as string | null };
}

export async function getPublishedPost(input: { slug: string } | { data: { slug: string } }) {
  const slug = "data" in input ? input.data.slug : input.slug;
  const { data: post, error } = await supabase
    .from("posts")
    .select("id, slug, title, description, category, cover_url, content_html, author_name, published_at")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return { post, error: null as string | null };
}

export function estimateReadingMinutes(html: string) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 220));
}

export function formatDatePtBr(iso: string | null | undefined) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}