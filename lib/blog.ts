// lib/blog.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/blog`);
    const data = await res.json();
    return data.success ? data.posts : [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/blog/${slug}`);
    const data = await res.json();
    return data.success ? data.post : null;
  } catch {
    return null;
  }
}