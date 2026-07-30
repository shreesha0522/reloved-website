"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/blog";
import { useCurrentUser } from "@/hooks/useCurrentUser";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const { loading: checking, isAdmin } = useCurrentUser();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("ReLoved Team");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (checking) return;
    if (!isAdmin) {
      router.push("/account");
    }
  }, [checking, isAdmin, router]);

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  if (checking) return null;
  if (!isAdmin) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !slug || !excerpt || !content || !image) {
      setError("All fields except author are required.");
      return;
    }

    setSubmitting(true);
    const result = await createPost({ title, slug, excerpt, content, image, author });

    if (result.success) {
      router.push("/blog");
    } else {
      setError(result.message || "Could not create post.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-16 py-10">
      <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-8">New blog post</h1>

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
            placeholder="Life After the First Owner: A Buyer's Story"
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">
            Slug <span className="text-xs text-[#6B7B76]">(auto-generated, editable)</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            placeholder="life-after-the-first-owner"
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
            placeholder="A short summary shown on the blog listing page."
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Write the full post here..."
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">Cover image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/photo.jpg"
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
            {submitting ? "Publishing..." : "Publish post"}
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