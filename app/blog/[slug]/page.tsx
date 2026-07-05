// app/blog/[slug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, BlogPost } from "@/lib/blog";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getPostBySlug(slug);
      setPost(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] px-6 py-12">
        <p className="text-center text-[#8A7F76] text-sm">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-[#2B2420] mb-3">Post not found</h1>
        <Link href="/blog" className="text-[#8C4A3A] underline">← Back to journal</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-6 md:px-16 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-sm text-[#8A7F76] hover:text-[#8C4A3A] mb-6 inline-block">
          ← Back to journal
        </Link>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-72 object-cover rounded-xl mb-8"
        />

        <p className="text-xs text-[#8A7F76] mb-2">
          {post.author} · {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <h1 className="font-display text-3xl md:text-4xl text-[#2B2420] mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="text-[#2B2420] leading-relaxed whitespace-pre-line text-[15px]">
          {post.content}
        </div>
      </div>
    </div>
  );
}