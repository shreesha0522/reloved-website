// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F2] px-4 md:px-16 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl md:text-5xl text-[#1A2E2A] mb-6">
          Our Story
        </h1>

        <p className="text-sm md:text-base text-[#4A5A55] leading-relaxed mb-6">
          ReLoved started with a simple idea: the best things don't need to be new,
          they just need to find the right home. Every item in our shop has already
          lived a life — a jacket that kept someone warm, a chair that held countless
          conversations, a book that was read late into the night. We believe those
          stories are worth continuing.
        </p>

        <p className="text-sm md:text-base text-[#4A5A55] leading-relaxed mb-6">
          We're a community marketplace for pre-loved clothing, furniture, books,
          accessories, and home goods. Every seller on ReLoved lists items they've
          cared for and are ready to pass on, and every buyer gets something with
          character — at a fraction of the cost of buying new.
        </p>

        <p className="text-sm md:text-base text-[#4A5A55] leading-relaxed mb-6">
          Buying secondhand isn't just about saving money. It's about giving good
          things a second story instead of letting them go to waste. Every purchase
          here means one less item in a landfill, and one more piece with history
          in someone's home.
        </p>

        <div className="bg-white rounded-xl p-6 md:p-8 mt-10">
          <h2 className="font-display text-xl md:text-2xl text-[#1A2E2A] mb-4">
            Why shop with ReLoved?
          </h2>
          <ul className="space-y-3 text-sm md:text-base text-[#4A5A55]">
            <li className="flex gap-2">
              <span className="text-[#4A6B5A] font-bold">✓</span>
              Every item is reviewed and approved before it's listed
            </li>
            <li className="flex gap-2">
              <span className="text-[#4A6B5A] font-bold">✓</span>
              Clear condition ratings, so you always know what you're getting
            </li>
            <li className="flex gap-2">
              <span className="text-[#4A6B5A] font-bold">✓</span>
              A community of sellers who care about where their things end up
            </li>
            <li className="flex gap-2">
              <span className="text-[#4A6B5A] font-bold">✓</span>
              Better for your wallet, and better for the planet
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}