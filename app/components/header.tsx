// app/components/Header.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, ChevronDown, Menu, X, Package, LogOut, Store, ShieldCheck} from "lucide-react";
import { getWishlistCount } from "@/lib/wishlist";
import { getCartCount } from "@/lib/cart";
import { getAllProducts, Product } from "@/lib/products";


interface Category {
  name: string;
  img: string;
}

const categories: Category[] = [
  { name: "Jewelry Collection", img: "jewelry.png" },
  { name: "Home Decor", img: "homedecor.png" },
  { name: "Accessories", img: "accessories1.png" },
  { name: "Candle", img: "candles1.png" },
  { name: "Crochet", img: "crochet.png" },
];

function routeFor(name: string) {
  const map: Record<string, string> = {
    "Jewelry Collection": "/shop/jewelry",
    "Home Decor": "/shop/home-decor",
    "Accessories": "/shop/accessories",
    "Candle": "/shop/candles",
    "Crochet": "/shop/crochet",
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAllProducts().then(setAllProducts);
  }, []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  setIsLoggedIn(!!localStorage.getItem("isLoggedIn"));
  setIsSeller(localStorage.getItem("userRole") === "seller");
  setIsAdmin(localStorage.getItem("userRole") === "admin");
}, []);

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

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setIsSeller(false);
    setIsAdmin(false);
    setAccountOpen(false);
    router.push("/");
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
    <header className="bg-[#FAF3EC] px-4 md:px-16 py-4 relative z-50 border-b border-[#E7DDD4]">
      <div className="flex items-center justify-between gap-4 md:gap-8">

        {/* Logo */}
        <div className="font-display text-xl md:text-2xl font-semibold whitespace-nowrap">
          Handmade Boutique
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
                    ? "text-[#8C4A3A] border-b-2 border-[#8C4A3A]"
                    : "hover:text-[#8C4A3A] border-b-2 border-transparent"
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
            <Search size={16} className="text-[#8A7F76] flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full text-sm text-[#2B2420] bg-transparent outline-none placeholder:text-[#8A7F76]"
            />
          </form>
          {isOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-lg border border-[#E7DDD4] overflow-hidden z-50">
              {filteredProducts.length > 0 && (
                <>
                  <div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider text-[#8A7F76]">
                    Products
                  </div>
                  {filteredProducts.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => {
                        router.push(`/shop/${p.category}/${p._id}`);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAF3EC] transition-colors cursor-pointer"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-9 h-9 rounded-md object-cover"
                      />
                      <span className="text-sm text-[#2B2420]">{p.name}</span>
                    </div>
                  ))}
                </>
              )}
              <div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider text-[#8A7F76]">
                Category Suggestions
              </div>
              {filtered.length === 0 ? (
                <div className="px-4 py-4 text-sm text-[#8A7F76]">No matches found.</div>
              ) : (
                <>
                  <div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider text-[#8A7F76]">
                    Category Suggestions
                  </div>
                  {filtered.length === 0 ? (
                    <div className="px-4 py-4 text-sm text-[#8A7F76]">No matches found.</div>
                  ) : (
                    filtered.map((cat) => (
                      <Link
                        key={cat.name}
                        href={routeFor(cat.name)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAF3EC] transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <img
                          src={`/images/${cat.img}`}
                          alt={cat.name}
                          className="w-9 h-9 rounded-md object-cover"
                        />
                        <span className="text-sm text-[#2B2420]">{cat.name}</span>
                      </Link>
                    ))
                  )}
                </>
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
                className="flex items-center gap-1 text-[#2B2420] hover:text-[#8C4A3A] transition-colors"
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
                <div className="absolute right-0 top-[calc(100%+10px)] w-48 bg-white rounded-xl shadow-lg border border-[#E7DDD4] overflow-hidden">
                  <button
                    onClick={() => { router.push("/account"); setAccountOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#2B2420] hover:bg-[#FAF3EC] transition-colors text-left"
                  >
                    <User size={16} strokeWidth={1.75} />
                    My Account
                  </button>
                  <button
                    onClick={() => { router.push("/account/orders"); setAccountOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#2B2420] hover:bg-[#FAF3EC] transition-colors text-left"
                  >
                    <Package size={16} strokeWidth={1.75} />
                    My Orders
                  </button>
                  {isSeller && (
                    <button
                      onClick={() => { router.push("/seller/dashboard"); setAccountOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#2B2420] hover:bg-[#FAF3EC] transition-colors text-left"
                    >
                      <Store size={16} strokeWidth={1.75} />
                      Seller Dashboard
                    </button>
                  )}
                  {isAdmin && (
  <button
    onClick={() => { router.push("/admin/users"); setAccountOpen(false); }}
    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#2B2420] hover:bg-[#FAF3EC] transition-colors text-left"
  >
    <ShieldCheck size={16} strokeWidth={1.75} />
    Admin Panel
  </button>
)}
{isAdmin && (
  <button
    onClick={() => { router.push("/admin/products"); setAccountOpen(false); }}
    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#2B2420] hover:bg-[#FAF3EC] transition-colors text-left"
  >
    <Package size={16} strokeWidth={1.75} />
    Product Approvals
  </button>
)}
                  <div className="h-px bg-[#E7DDD4]" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#8C4A3A] hover:bg-[#FAF3EC] transition-colors text-left"
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
              className="text-[#2B2420] hover:text-[#8C4A3A] transition-colors"
            >
              <User size={20} strokeWidth={1.75} />
            </button>
          )}

          <Link
            href="/wishlist"
            title="Wishlist"
            className="relative text-[#2B2420] hover:text-[#8C4A3A] transition-colors"
          >
            <Heart size={20} strokeWidth={1.75} />
            {wishlistCount > 0 && (
              <sup className="absolute -top-2 -right-2.5 bg-[#8C4A3A] text-white text-[9px] rounded-full px-1.5 py-0.5 leading-none">
                {wishlistCount}
              </sup>
            )}
          </Link>

          <Link
            href="/cart"
            title="Cart"
            className="relative text-[#2B2420] hover:text-[#8C4A3A] transition-colors"
          >
            <ShoppingCart size={20} strokeWidth={1.75} />
            {cartCount > 0 && (
              <sup className="absolute -top-2 -right-2.5 bg-[#8C4A3A] text-white text-[9px] rounded-full px-1.5 py-0.5 leading-none">
                {cartCount}
              </sup>
            )}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden text-[#2B2420]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-[#FAF3EC] border-t border-[#E7DDD4] px-2 py-4 mt-4 flex flex-col gap-4">
          <div className="md:hidden flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm mb-2">
            <Search size={16} className="text-[#8A7F76] flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-sm text-[#2B2420] bg-transparent outline-none placeholder:text-[#8A7F76]"
            />
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm ${isActive ? "text-[#8C4A3A] font-medium" : "hover:text-[#8C4A3A]"}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          {!isLoggedIn && (
            <button
              onClick={() => { router.push("/login"); setMenuOpen(false); }}
              className="text-sm text-left text-[#8C4A3A] font-medium"
            >
              Login / Sign Up
            </button>
          )}
          {isLoggedIn && (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="text-sm text-left text-[#8C4A3A] font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}