"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllPosts, deletePost, BlogPost } from "@/lib/blog";
import { Clock, Pencil, Trash2 } from "lucide-react";

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("userRole") === "admin");
  }, []);

  useEffect(() => {
    async function load() {
      const data = await getAllPosts();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setDeletingId(id);
    const result = await deletePost(id);
    if (result.success) {
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } else {
      alert(result.message || "Could not delete post.");
    }
    setDeletingId(null);
  }

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-16 py-12 md:py-16">
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <span className="inline-block text-[11px] uppercase tracking-wider text-[#6B7B76] border border-[#D8E0D9] rounded-full px-4 py-1.5 mb-5">
          The Journal
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-[#1A2E2A] mb-3">Our Journal</h1>
        <p className="text-sm md:text-base text-[#6B7B76]">
          Stories from our sellers, styling ideas, and life after the first owner.
        </p>

        {isAdmin && (
          <button
            onClick={() => router.push("/blog/new")}
            className="mt-6 inline-flex items-center gap-2 bg-[#4A6B5A] hover:bg-[#3a5548] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            New Post
          </button>
        )}
      </div>

      {loading && (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-5">
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-5 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[#6B7B76] text-lg mb-2">No posts yet.</p>
          <p className="text-[#6B7B76] text-sm">Check back soon for stories from our community.</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="max-w-6xl mx-auto">
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden mb-10 md:grid md:grid-cols-2 hover:shadow-md transition-shadow relative"
            >
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/blog/edit/${featured._id}`);
                    }}
                    className="w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center text-[#4A6B5A] hover:bg-white transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, featured._id)}
                    disabled={deletingId === featured._id}
                    className="w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center text-red-600 hover:bg-white transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>
              )}

              <div className="h-56 md:h-full overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-[#6B7B76] mb-3">
                  <span>
                    {new Date(featured.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#D8E0D9]" />
                  <span className="flex items-center gap-1">
                    <Clock size={12} strokeWidth={1.75} />
                    {readingTime(featured.content)}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-[#1A2E2A] mb-3 leading-snug">
                  {featured.title}
                </h2>
                <p className="text-sm md:text-base text-[#4a5a55] line-clamp-3 mb-4">
                  {featured.excerpt}
                </p>
                <span className="text-sm font-medium text-[#4A6B5A] group-hover:underline">
                  Read the story →
                </span>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all relative"
                >
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/blog/edit/${post._id}`);
                        }}
                        className="w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center text-[#4A6B5A] hover:bg-white transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, post._id)}
                        disabled={deletingId === post._id}
                        className="w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center text-red-600 hover:bg-white transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={14} strokeWidth={1.75} />
                      </button>
                    </div>
                  )}

                  <div className="overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-[1.05] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[#6B7B76] mb-2">
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
                    <h2 className="font-display text-xl text-[#1A2E2A] mb-2 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-[#4a5a55] line-clamp-3">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}