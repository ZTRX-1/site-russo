import { marked } from "marked";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  category: string;
  cover?: string;
  author?: string;
  readingMinutes: number;
  html: string;
  raw: string;
}

// Bundle-time import de todos os markdowns
const rawModules = import.meta.glob("/src/content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parseFrontmatter(input: string): { data: Record<string, string>; body: string } {
  const match = input.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: input };
  const data: Record<string, string> = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  });
  return { data, body: match[2] };
}

function estimateReadingMinutes(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function buildPost(filepath: string, raw: string): BlogPost {
  const { data, body } = parseFrontmatter(raw);
  const fallbackSlug = filepath.split("/").pop()!.replace(/\.md$/, "");
  const html = marked.parse(body, { async: false }) as string;
  return {
    slug: data.slug || fallbackSlug,
    title: data.title || fallbackSlug,
    description: data.description || "",
    date: data.date || new Date().toISOString().slice(0, 10),
    category: data.category || "Geral",
    cover: data.cover || undefined,
    author: data.author || "Equipe Russo",
    readingMinutes: estimateReadingMinutes(body),
    html,
    raw: body,
  };
}

let cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (cache) return cache;
  const posts = Object.entries(rawModules).map(([path, raw]) => buildPost(path, raw));
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = posts;
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, limit);
}

export function formatDatePtBr(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}