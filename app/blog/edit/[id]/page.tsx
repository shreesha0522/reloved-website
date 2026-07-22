"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostById, updatePost } from "@/lib/blog";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loadingPost, setLoadingPost] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      router.push("/account");
      return;
    }
    setIsAdmin(true);
    setChecking(false);
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;

    async function load() {
      const post = await getPostById(id);
      if (!post) {
        setNotFound(true);
        setLoadingPost(false);
        return;
      }
      setTitle(post.title);
      setSlug(post.slug);
      setSlugEdited(true); // don't overwrite the existing slug automatically
      setExcerpt(post.excerpt);
      setContent(post.content);
      setImage(post.image);
      setAuthor(post.author);
      setLoadingPost(false);
    }
    load();
  }, [isAdmin, id]);

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  if (checking || loadingPost) return null;
  if (!isAdmin) return null;

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#F4F6F2] px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-[#1A2E2A] mb-3">Post not found</h1>
        <button
          onClick={() => router.push("/blog")}
          className="text-[#4A6B5A] underline text-sm"
        >
          ← Back to journal
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !slug || !excerpt || !content || !image) {
      setError("All fields except author are required.");
      return;
    }

    setSubmitting(true);
    const result = await updatePost(id, { title, slug, excerpt, content, image, author });

    if (result.success) {
      router.push("/blog");
    } else {
      setError(result.message || "Could not update post.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-16 py-10">
      <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-8">Edit blog post</h1>

      <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-5">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">
            Slug <span className="text-xs text-[#6B7B76]">(editable — changing it changes the post URL)</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
          <p className="text-xs text-[#6B7B76] mt-1">
            This will be the URL: /blog/{slug || "your-slug-here"}
          </p>
        </div>

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">Cover image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
          {image && (
            <img src={image} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-lg border border-[#D8E0D9]" />
          )}
        </div>

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-[#4A6B5A] hover:bg-[#3a5548] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm tracking-wide"
          >
            {submitting ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/blog")}
            className="px-6 border border-[#D8E0D9] text-[#1A2E2A] rounded-lg text-sm hover:bg-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}