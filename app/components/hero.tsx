export default function Hero() {
  return (
    <section className="bg-[#F6E9E5] px-6 md:px-16 py-14 md:py-16 relative">
      <div className="grid md:grid-cols-[1fr_1.3fr] gap-10 items-center">
        <div>
          <span className="inline-block text-[11px] uppercase tracking-wider text-[#8A7F76] border border-[#E7DDD4] rounded-full px-4 py-1.5 mb-4">
            Seasonal Arrivals
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-8">
            NEW Collection
          </h1>
          <button className="bg-[#8C4A3A] hover:bg-[#6E3A2D] text-white text-sm px-7 py-3.5 rounded-lg transition-colors">
            Shop Now
          </button>
        </div>

        <div>
          <img
            src="/images/hero.png"
            alt="Handmade ceramics collection"
            className="w-full h-[260px] md:h-[420px] object-cover rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6 md:absolute md:bottom-6 md:left-1/2 md:-translate-x-[30%]">
        <span className="w-5 h-2 rounded-full bg-[#8C4A3A]" />
        <span className="w-2 h-2 rounded-full bg-[#8C4A3A]/25" />
        <span className="w-2 h-2 rounded-full bg-[#8C4A3A]/25" />
      </div>
    </section>
  );
}