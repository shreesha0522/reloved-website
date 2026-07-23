// app/components/Header.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, ChevronDown, Menu, X, Package, LogOut, Store, ShieldCheck} from "lucide-react";
import { getWishlistCount } from "@/lib/wishlist";
import { getCartCount } from "@/lib/cart";
import { getAllProducts, Product } from "@/lib/products";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout as logoutRequest } from "@/lib/auth";


interface Category {
  name: string;
  img: string;
}

const categories: Category[] = [
  { name: "Clothing", img: "clothing.png" },
  { name: "Furniture", img: "furniture.png" },
  { name: "Books", img: "books.png" },
  { name: "Accessories", img: "accessories.png" },
  { name: "Home Goods", img: "home-goods.png" },
];

function routeFor(name: string) {
  const map: Record<string, string> = {
    "Clothing": "/shop/clothing",
    "Furniture": "/shop/furniture",
    "Books": "/shop/books",
    "Accessories": "/shop/accessories",
    "Home Goods": "/shop/home-goods",
  };
  return map[name] ?? "/shop";
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Pages", href: "/pages" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const { isLoggedIn, isSeller, isAdmin, refetch } = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAllProducts().then(setAllProducts);
  }, []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCount() {
      if (isLoggedIn) {
        const count = await getWishlistCount();
        setWishlistCount(count);
      } else {
        setWishlistCount(0);
      }
    }
    loadCount();

    window.addEventListener("wishlist-updated", loadCount);
    return () => window.removeEventListener("wishlist-updated", loadCount);
  }, [isLoggedIn]);

  useEffect(() => {
    async function loadCartCount() {
      if (isLoggedIn) {
        const count = await getCartCount();
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    }
    loadCartCount();

    window.addEventListener("cart-updated", loadCartCount);
    return () => window.removeEventListener("cart-updated", loadCartCount);
  }, [isLoggedIn]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setProductResults([]);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      const results = await getAllProducts(undefined, query.trim());
      setProductResults(results);
      setSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await logoutRequest(); // clears the httpOnly cookie server-side
    await refetch();       // refreshes local user state to null
    setAccountOpen(false);
    router.push("/");
    router.refresh();
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = query.trim()
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="bg-[#4A6B5A] px-4 md:px-16 py-4 relative z-50 border-b border-[#3a5548]">
      <div className="flex items-center justify-between gap-4 md:gap-8">

     {/* Logo */}
<div className="font-display text-xl md:text-2xl font-semibold whitespace-nowrap text-white">
  ReLoved
</div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex gap-7 text-sm flex-shrink-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`pb-1 transition-colors ${
                  isActive
                    ? "text-white border-b-2 border-white"
                    : "text-[#D8E0D9] hover:text-white border-b-2 border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search bar — inline, same row */}
        <div className="relative flex-1 max-w-xs hidden md:block" ref={wrapperRef}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                setIsOpen(false);
              }
            }}
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm"
          >
            <Search size={16} className="text-[#6B7B76] flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full text-sm text-[#1A2E2A] bg-transparent outline-none placeholder:text-[#6B7B76]"
            />
          </form>
          {isOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-lg border border-[#D8E0D9] overflow-hidden z-50">
              {filteredProducts.length > 0 && (
                <>
                  <div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider text-[#6B7B76]">
                    Products
                  </div>
                  {filteredProducts.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => {
                        router.push(`/shop/${p.category}/${p._id}`);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8EDE6] transition-colors cursor-pointer"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-9 h-9 rounded-md object-cover"
                      />
                      <span className="text-sm text-[#1A2E2A]">{p.name}</span>
                    </div>
                  ))}
                </>
              )}
              <div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider text-[#6B7B76]">
                Category Suggestions
              </div>
              {filtered.length === 0 ? (
                <div className="px-4 py-4 text-sm text-[#6B7B76]">No matches found.</div>
              ) : (
                filtered.map((cat) => (
                  <Link
                    key={cat.name}
                    href={routeFor(cat.name)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8EDE6] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <img
                      src={`/images/${cat.img}`}
                      alt={cat.name}
                      className="w-9 h-9 rounded-md object-cover"
                    />
                    <span className="text-sm text-[#1A2E2A]">{cat.name}</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4 md:gap-5 flex-shrink-0">
          {isLoggedIn ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-1 text-white hover:text-[#D8E0D9] transition-colors"
                title="My Account"
              >
                <User size={20} strokeWidth={1.75} />
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  className={`hidden md:block transition-transform ${accountOpen ? "rotate-180" : ""}`}
                />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-48 bg-white rounded-xl shadow-lg border border-[#D8E0D9] overflow-hidden">
                  <button
                    onClick={() => { router.push("/account"); setAccountOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#1A2E2A] hover:bg-[#E8EDE6] transition-colors text-left"
                  >
                    <User size={16} strokeWidth={1.75} />
                    My Account
                  </button>
                  <button
                    onClick={() => { router.push("/account/orders"); setAccountOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#1A2E2A] hover:bg-[#E8EDE6] transition-colors text-left"
                  >
                    <Package size={16} strokeWidth={1.75} />
                    My Orders
                  </button>
                  {isSeller && (
                    <button
                      onClick={() => { router.push("/seller/dashboard"); setAccountOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#1A2E2A] hover:bg-[#E8EDE6] transition-colors text-left"
                    >
                      <Store size={16} strokeWidth={1.75} />
                      Seller Dashboard
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => { router.push("/admin/users"); setAccountOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#1A2E2A] hover:bg-[#E8EDE6] transition-colors text-left"
                    >
                      <ShieldCheck size={16} strokeWidth={1.75} />
                      Admin Panel
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => { router.push("/admin/products"); setAccountOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#1A2E2A] hover:bg-[#E8EDE6] transition-colors text-left"
                    >
                      <Package size={16} strokeWidth={1.75} />
                      Product Approvals
                    </button>
                  )}
                  <div className="h-px bg-[#D8E0D9]" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#4A6B5A] hover:bg-[#E8EDE6] transition-colors text-left"
                  >
                    <LogOut size={16} strokeWidth={1.75} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              title="Login"
              onClick={() => router.push("/login")}
              className="text-white hover:text-[#D8E0D9] transition-colors"
            >
              <User size={20} strokeWidth={1.75} />
            </button>
          )}

          <Link
            href="/wishlist"
            title="Wishlist"
            className="relative text-white hover:text-[#D8E0D9] transition-colors"
          >
            <Heart size={20} strokeWidth={1.75} />
            {wishlistCount > 0 && (
              <sup className="absolute -top-2 -right-2.5 bg-white text-[#4A6B5A] text-[9px] rounded-full px-1.5 py-0.5 leading-none">
                {wishlistCount}
              </sup>
            )}
          </Link>

          <Link
            href="/cart"
            title="Cart"
            className="relative text-white hover:text-[#D8E0D9] transition-colors"
          >
            <ShoppingCart size={20} strokeWidth={1.75} />
            {cartCount > 0 && (
              <sup className="absolute -top-2 -right-2.5 bg-white text-[#4A6B5A] text-[9px] rounded-full px-1.5 py-0.5 leading-none">
                {cartCount}
              </sup>
            )}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-[#4A6B5A] border-t border-[#3a5548] px-2 py-4 mt-4 flex flex-col gap-4">
          <div className="md:hidden flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm mb-2">
            <Search size={16} className="text-[#6B7B76] flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-sm text-[#1A2E2A] bg-transparent outline-none placeholder:text-[#6B7B76]"
            />
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm ${isActive ? "text-white font-medium" : "text-[#D8E0D9] hover:text-white"}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          {!isLoggedIn && (
            <button
              onClick={() => { router.push("/login"); setMenuOpen(false); }}
              className="text-sm text-left text-white font-medium"
            >
              Login / Sign Up
            </button>
          )}
          {isLoggedIn && (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="text-sm text-left text-white font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}