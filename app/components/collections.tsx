import Link from "next/link";

export default function Collections() {
  return (
    <section className="px-6 md:px-16 py-16">
      <div className="mb-9">
        <h2 className="font-display text-3xl mb-1">Curated Collections</h2>
        <p className="text-sm text-[#8A7F76]">Thoughtfully designed, expertly crafted.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link
          href="/shop/jewelry"
          className="relative rounded-lg overflow-hidden min-h-[200px] md:row-span-2 flex items-end p-6 text-white bg-cover bg-center"
          style={{ backgroundImage: `url('/images/jewelry.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/5" />
          <div className="relative z-10">
            <h3 className="font-display text-xl font-semibold mb-1">Jewelry Collection</h3>
            <span className="text-sm">Explore Pieces →</span>
          </div>
        </Link>

        <Link
          href="/shop/home-decor"
          className="relative rounded-lg overflow-hidden min-h-[200px] md:col-span-2 flex items-end p-6 text-white bg-cover bg-center"
          style={{ backgroundImage: `url('/images/home-decor.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/5" />
          <div className="relative z-10">
            <h3 className="font-display text-xl font-semibold mb-1">Home Decor</h3>
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
          href="/shop/candles"
          className="relative rounded-lg overflow-hidden min-h-[200px] flex items-end p-6 text-white bg-cover bg-center"
          style={{ backgroundImage: `url('/images/candles.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/5" />
          <div className="relative z-10">
            <h3 className="font-display text-xl font-semibold mb-1">Candles</h3>
            <span className="text-sm">Pure Ambiance →</span>
          </div>
        </Link>
      </div>
    </section>
  );
}