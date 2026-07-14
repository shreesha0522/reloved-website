"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProductById, Product } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import { getWishlist, toggleWishlist } from "@/lib/wishlist";
import { getProductReviews, createReview, deleteReview, Review } from "@/lib/reviews";



export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.category as string;
  const productId = params.product as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
const [myUserId, setMyUserId] = useState<string | null>(null);
const [newRating, setNewRating] = useState(5);
const [newComment, setNewComment] = useState("");
const [submittingReview, setSubmittingReview] = useState(false);
const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("isLoggedIn"));
  }, []);
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setMyUserId(payload.id);
    } catch {
      setMyUserId(null);
    }
  }
}, []);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const p = await getProductById(productId);
      setProduct(p);
      setLoading(false);
    }
    if (productId) loadProduct();
  }, [productId]);

  useEffect(() => {
    async function checkWishlist() {
      if (product) {
        const list = await getWishlist();
        setIsFav(list.some((i) => i.id === product._id));
      }
    }
    checkWishlist();
  }, [product]);
  useEffect(() => {
  async function loadReviews() {
    if (product) {
      const data = await getProductReviews(product._id);
      setReviews(data);
    }
  }
  loadReviews();
}, [product]);

  if (loading) {
    return (
      <div className="py-20 text-center px-4">
        <p className="text-sm text-[#6B7B76]">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center px-4">
        <h1 className="font-display text-2xl mb-3">Product not found</h1>
        <Link href="/" className="text-[#4A6B5A] underline">Back to home</Link>
      </div>
    );
  }

  async function handleToggleWishlist() {
    const wasAdded = await toggleWishlist({
      id: product!._id,
      name: product!.name,
      price: product!.price,
      image: product!.image,
      category: product!.category,
    });
    setIsFav(wasAdded);
  }

async function handleAddToCart() {
  if (!isLoggedIn) {
    router.push("/login");
    return;
  }
  const result = await addToCart(product!._id, quantity);
  if (result.success) {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  } else {
    alert(result.message || "Could not add to cart.");
  }
}
  async function handleSubmitReview(e: React.FormEvent) {
  e.preventDefault();
  setReviewError("");

  if (!isLoggedIn) {
    router.push("/login");
    return;
  }
  if (!newComment.trim()) {
    setReviewError("Please write a comment.");
    return;
  }

  setSubmittingReview(true);
  const result = await createReview(product!._id, { rating: newRating, comment: newComment });
  setSubmittingReview(false);

  if (result.success) {
    setNewComment("");
    setNewRating(5);
    const data = await getProductReviews(product!._id);
    setReviews(data);
    const refreshed = await getProductById(product!._id);
    if (refreshed) setProduct(refreshed);
  } else {
    setReviewError(result.message || "Could not submit review.");
  }
}

async function handleDeleteReview(reviewId: string) {
  if (!confirm("Delete your review?")) return;
  const result = await deleteReview(reviewId);
  if (result.success) {
    const data = await getProductReviews(product!._id);
    setReviews(data);
    const refreshed = await getProductById(product!._id);
    if (refreshed) setProduct(refreshed);
  }
}

  const rating = Math.round(product.rating || 0);
  const maxQty = Math.max(product.stock, 0);

  return (
    <section className="bg-[#E8EDE6] min-h-screen px-4 md:px-16 py-8 md:py-10">
      <Link href={`/shop/${slug}`} className="text-sm text-[#6B7B76] hover:text-[#4A6B5A] mb-6 inline-block">
        ← Back to {slug}
      </Link>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-xl object-cover"
        />
        <div className="relative pt-2">
          <button
            onClick={handleToggleWishlist}
            className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white border border-[#D8E0D9] flex items-center justify-center text-[#4A6B5A]"
            title={isFav ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isFav ? "❤️" : "♡"}
          </button>
        <h1 className="font-display text-3xl md:text-4xl mb-2">{product.name}</h1>
<div className="flex items-center gap-3 mb-4 flex-wrap">
  <div className="text-sm text-[#d6a157]">
    {"★".repeat(rating)}
    {"☆".repeat(5 - rating)}{" "}
    <span className="text-[#6B7B76]">({product.reviews || 0} Reviews)</span>
  </div>
  {product.condition && (
    <span className="text-xs font-medium text-[#4A6B5A] bg-[#E8EDE6] px-3 py-1 rounded-full">
      Condition: {product.condition}
    </span>
  )}
  {product.size && product.size !== "N/A" && (
    <span className="text-xs font-medium text-[#4A6B5A] bg-[#E8EDE6] px-3 py-1 rounded-full">
      Size: {product.size}
    </span>
  )}
</div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl text-[#4A6B5A] font-semibold">Rs {product.price}</span>
            <span className="text-xs text-[#6B7B76]">Local taxes included</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs bg-[#E8EDE6] text-[#1A2E2A] px-3 py-1.5 rounded-full mb-6 mt-2">
            ✓ {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>

          {product.description && (
            <p className="text-sm text-[#4a5a55] mb-6 leading-relaxed">{product.description}</p>
          )}

          {maxQty > 1 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-[#1A2E2A] mb-1.5">Quantity</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
                >
                  {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {maxQty === 1 && (
            <p className="text-xs text-[#6B7B76] mb-6">
              This is a one-of-a-kind item — only 1 available.
            </p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full bg-[#4A6B5A] hover:bg-[#3A5548] disabled:opacity-50 text-white uppercase text-sm tracking-wide py-3.5 rounded-lg transition-colors"
          >
            {added ? "Added ✓" : product.stock <= 0 ? "Out of stock" : "Add to Cart"}
          </button>

          {!isLoggedIn && (
            <p className="text-xs text-[#6B7B76] mt-3 text-center">
              You'll need to{" "}
              <button onClick={() => router.push("/login")} className="underline hover:text-[#4A6B5A]">
                log in
              </button>{" "}
              to add items to your cart.
            </p>
          )}
        </div>
      </div>

      {/* Reviews section */}
      <div className="max-w-5xl mx-auto mt-12 bg-white rounded-xl p-6 md:p-10">
        <h2 className="font-display text-2xl mb-4">Reviews for this item</h2>
        <div className="flex items-center gap-3 mb-8">
          <span className="font-display text-5xl">{rating.toFixed(1)}</span>
          <div>
            <div className="text-[#b8935a]">
              {"★".repeat(rating)}
              {"☆".repeat(5 - rating)}
            </div>
            <div className="text-xs text-[#6B7B76] uppercase tracking-wide">
              {product.reviews} {product.reviews === 1 ? "Review" : "Reviews"}
            </div>
          </div>
        </div>

        {/* Submit a review */}
        <div className="border border-[#D8E0D9] rounded-lg p-5 mb-10">
          <h3 className="text-sm font-medium text-[#1A2E2A] mb-3">Write a review</h3>

          {reviewError && (
            <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
              {reviewError}
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#1A2E2A]">Your rating:</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="border border-[#D8E0D9] rounded-lg px-3 py-1.5 text-sm bg-white"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={3}
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="self-start bg-[#4A6B5A] hover:bg-[#3a5548] disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              {submittingReview ? "Submitting..." : "Submit review"}
            </button>
          </form>
        </div>

        {/* Review list */}
        {reviews.length === 0 ? (
          <p className="text-sm text-[#6B7B76]">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, i) => (
              <div key={review._id} className={i > 0 ? "pt-6 border-t border-[#D8E0D9]" : ""}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E8EDE6] text-[#4A6B5A] flex items-center justify-center text-xs font-semibold">
                      {review.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{review.username}</div>
                      <div className="text-xs text-[#b8935a]">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6B7B76]">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {myUserId === review.userId && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[#1A2E2A] leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}