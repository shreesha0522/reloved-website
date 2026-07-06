// app/blog/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPosts, BlogPost } from "@/lib/blog";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllPosts();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-16 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl text-[#1A2E2A] mb-2">Our Journal</h1>
        <p className="text-sm text-[#6B7B76]">Stories from the studio, craft notes, and behind-the-scenes.</p>
      </div>

      {loading ? (
        <p className="text-center text-[#6B7B76] text-sm">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-[#6B7B76] text-sm">No posts yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <p className="text-xs text-[#6B7B76] mb-2">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <h2 className="font-display text-xl text-[#1A2E2A] mb-2 leading-snug">{post.title}</h2>
                <p className="text-sm text-[#4a5a55] line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}