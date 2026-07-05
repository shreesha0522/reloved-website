// app/page.tsx
import Hero from "./components/hero";
import Collections from "./components/collections";
import Products from "./components/products";

export default function Home() {
  return (
    <main>
      <Hero />
      <Collections />
      <Products />
    </main>
  );
}