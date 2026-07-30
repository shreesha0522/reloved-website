import Link from "next/link";
export default function Collections() {
return (
<section className="px-6 md:px-16 py-16">
<div className="mb-9">
<h2 className="font-display text-3xl mb-1">Curated Collections</h2>
<p className="text-sm text-[#6B7B76]">Pre-loved pieces, given a second story.</p>
</div>
<div className="grid md:grid-cols-3 gap-4">
<Link
href="/shop/clothing"
className="relative rounded-lg overflow-hidden min-h-[200px] md:row-span-2 flex items-end p-6 text-white bg-cover bg-center"
style={{ backgroundImage: `url('/images/clothing.png')` }}
>
<div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/5" />
<div className="relative z-10">
<h3 className="font-display text-xl font-semibold mb-1">Clothing</h3>
<span className="text-sm">Explore Pieces →</span>
</div>
</Link>
<Link
  href="/shop/furniture"
  className="relative rounded-lg overflow-hidden min-h-[200px] md:col-span-2 flex items-end p-6 text-white bg-cover"
  style={{ backgroundImage: `url('/images/furniture.png')`, backgroundPosition: "center 55%" }}
>
<div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/5" />
<div className="relative z-10">
<h3 className="font-display text-xl font-semibold mb-1">Furniture</h3>
<span className="text-sm">Elevate Your Space →</span>
</div>
</Link>
<Link
href="/shop/accessories"
className="relative rounded-lg overflow-hidden min-h-[200px] flex items-end p-6 text-white bg-cover bg-center"
style={{ backgroundImage: `url('/images/accessories.png')` }}
>
<div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/5" />
<div className="relative z-10">
<h3 className="font-display text-xl font-semibold mb-1">Accessories</h3>
<span className="text-sm">Shop Accessories →</span>
</div>
</Link>
<Link
href="/shop/books"
className="relative rounded-lg overflow-hidden min-h-[200px] flex items-end p-6 text-white bg-cover bg-center"
style={{ backgroundImage: `url('/images/books.png')` }}
>
<div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/5" />
<div className="relative z-10">
<h3 className="font-display text-xl font-semibold mb-1">Books</h3>
<span className="text-sm">Browse Stories →</span>
</div>
</Link>
</div>
</section>
  );
}