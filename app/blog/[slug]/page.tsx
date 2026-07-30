"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, BlogPost } from "@/lib/blog";
import { ArrowLeft, Clock, Link2, Check } from "lucide-react";

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getPostBySlug(slug);
      setPost(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F2] px-6 py-12">
        <div className="max-w-2xl mx-auto animate-pulse">
          <div className="h-72 bg-gray-200 rounded-xl mb-8" />
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-8 bg-gray-200 rounded mb-3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F4F6F2] px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-[#1A2E2A] mb-3">Post not found</h1>
        <Link href="/blog" className="text-[#4A6B5A] underline">← Back to journal</Link>
      </div>
    );
  }

  const authorInitials = post.author
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-16 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7B76] hover:text-[#4A6B5A] mb-6 transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          Back to journal
        </Link>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-72 md:h-96 object-cover rounded-xl mb-8"
        />

        <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-5 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-[#D8E0D9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E8EDE6] text-[#4A6B5A] flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {authorInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A2E2A]">{post.author}</p>
              <div className="flex items-center gap-2 text-xs text-[#6B7B76]">
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#D8E0D9]" />
                <span className="flex items-center gap-1">
                  <Clock size={11} strokeWidth={1.75} />
                  {readingTime(post.content)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs text-[#4A6B5A] border border-[#D8E0D9] hover:border-[#4A6B5A] rounded-full px-3.5 py-2 transition-colors"
          >
            {copied ? <Check size={13} strokeWidth={2} /> : <Link2 size={13} strokeWidth={1.75} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <div className="text-[#1A2E2A] leading-relaxed whitespace-pre-line text-[15px]">
          {post.content}
        </div>

        <div className="mt-12 pt-8 border-t border-[#D8E0D9] text-center">
          <Link
            href="/blog"
            className="inline-block bg-[#4A6B5A] hover:bg-[#3a5548] text-white text-sm font-medium px-7 py-3 rounded-lg transition-colors"
          >
            Read more stories
          </Link>
        </div>
      </div>
    </div>
  );
}