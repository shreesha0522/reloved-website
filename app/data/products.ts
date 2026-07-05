export type Product = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  img: string;
  subcategory: string;
};

export type CategoryData = {
  slug: string;
  title: string;
  filters: string[];
  products: Product[];
};

export const categories: Record<string, CategoryData> = {
  jewelry: {
    slug: "jewelry",
    title: "Jewelry Collection",
    filters: ["All Items", "Necklaces", "Rings", "Earrings"],
    products: [
      { id: "1", name: "Beans Necklace", price: 1000, rating: 4, reviews: 42, img: "beans-necklace", subcategory: "Necklaces" },
      { id: "2", name: "Earrings", price: 600, rating: 5, reviews: 18, img: "earrings1", subcategory: "Earrings" },
      { id: "3", name: "Ring", price: 200, rating: 3, reviews: 5, img: "ring1", subcategory: "Rings" },
      { id: "4", name: "Bands", price: 900, rating: 4, reviews: 29, img: "bands", subcategory: "Rings" },
      { id: "5", name: "Necklace", price: 2000, rating: 5, reviews: 53, img: "necklace2", subcategory: "Necklaces" },
      { id: "6", name: "Heart Ring", price: 500, rating: 4, reviews: 12, img: "heart-ring", subcategory: "Rings" },
      { id: "7", name: "Circle Earrings", price: 800, rating: 5, reviews: 31, img: "circle-earrings", subcategory: "Earrings" },
      { id: "8", name: "Hand Bands", price: 400, rating: 3, reviews: 24, img: "hand-bands", subcategory: "Rings" },
    ],
  },
  "home-decor": {
    slug: "home-decor",
    title: "Home Decor",
    filters: ["All Items", "Vases", "Pots", "Lighting"],
    products: [
      { id: "9", name: "Ceramic Vase", price: 1200, rating: 4, reviews: 20, img: "vase1", subcategory: "Vases" },
      { id: "10", name: "Terra Pot", price: 700, rating: 5, reviews: 15, img: "pot1", subcategory: "Pots" },
      { id: "11", name: "Table Lamp", price: 1800, rating: 4, reviews: 9, img: "lamp1", subcategory: "Lighting" },
      { id: "12", name: "Decorative Bowl", price: 600, rating: 5, reviews: 33, img: "bowl1", subcategory: "Vases" },
    ],
  },
  accessories: {
    slug: "accessories",
    title: "Accessories",
    filters: ["All Items", "Bags", "Scarves"],
    products: [
      { id: "13", name: "Woven Tote", price: 1500, rating: 5, reviews: 27, img: "tote1", subcategory: "Bags" },
      { id: "14", name: "Leather Bag", price: 2200, rating: 4, reviews: 14, img: "bag1", subcategory: "Bags" },
      { id: "15", name: "Linen Scarf", price: 450, rating: 5, reviews: 19, img: "scarf1", subcategory: "Scarves" },
    ],
  },
  candles: {
    slug: "candles",
    title: "Candles",
    filters: ["All Items", "Scented", "Unscented"],
    products: [
      { id: "16", name: "Lavender Candle", price: 350, rating: 5, reviews: 41, img: "candle1", subcategory: "Scented" },
      { id: "17", name: "Vanilla Candle", price: 380, rating: 4, reviews: 22, img: "candle2", subcategory: "Scented" },
      { id: "18", name: "Plain Pillar", price: 250, rating: 4, reviews: 8, img: "candle3", subcategory: "Unscented" },
    ],
  },
};