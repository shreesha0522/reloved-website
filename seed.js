require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');

  const seller = await User.findOne({ role: 'seller' });
  if (!seller) {
    console.log('No seller found. Please create a seller account first.');
    process.exit(1);
  }
  console.log('Using seller:', seller.email);

  const products = [
    { name: 'Beans Necklace',  price: 1000, category: 'jewelry',     subcategory: 'Necklaces', image: 'https://picsum.photos/seed/beans-necklace/400/400',  description: 'A playful handcrafted bean-shaped necklace.', stock: 10, rating: 4, reviews: 42, sellerId: seller._id },
    { name: 'Earrings',        price: 600,  category: 'jewelry',     subcategory: 'Earrings',  image: 'https://picsum.photos/seed/earrings1/400/400',        description: 'Lightweight clay earrings.',                  stock: 15, rating: 5, reviews: 18, sellerId: seller._id },
    { name: 'Ring',            price: 200,  category: 'jewelry',     subcategory: 'Rings',     image: 'https://picsum.photos/seed/ring1/400/400',            description: 'A minimalist handmade ring.',                 stock: 20, rating: 3, reviews: 5,  sellerId: seller._id },
    { name: 'Bands',           price: 900,  category: 'jewelry',     subcategory: 'Rings',     image: 'https://picsum.photos/seed/bands/400/400',            description: 'Woven artisan bands.',                        stock: 8,  rating: 4, reviews: 29, sellerId: seller._id },
    { name: 'Necklace',        price: 2000, category: 'jewelry',     subcategory: 'Necklaces', image: 'https://picsum.photos/seed/necklace2/400/400',        description: 'An elegant handmade necklace.',               stock: 5,  rating: 5, reviews: 53, sellerId: seller._id },
    { name: 'Heart Ring',      price: 500,  category: 'jewelry',     subcategory: 'Rings',     image: 'https://picsum.photos/seed/heart-ring/400/400',       description: 'A romantic heart-shaped ring.',               stock: 12, rating: 4, reviews: 12, sellerId: seller._id },
    { name: 'Circle Earrings', price: 800,  category: 'jewelry',     subcategory: 'Earrings',  image: 'https://picsum.photos/seed/circle-earrings/400/400',  description: 'Bold circular earrings.',                     stock: 10, rating: 5, reviews: 31, sellerId: seller._id },
    { name: 'Hand Bands',      price: 400,  category: 'jewelry',     subcategory: 'Rings',     image: 'https://picsum.photos/seed/hand-bands/400/400',       description: 'Colorful woven hand bands.',                  stock: 18, rating: 3, reviews: 24, sellerId: seller._id },
    { name: 'Ceramic Vase',    price: 1200, category: 'home-decor',  subcategory: 'Vases',     image: 'https://picsum.photos/seed/vase1/400/400',            description: 'Handcrafted ceramic vase.',                   stock: 7,  rating: 4, reviews: 20, sellerId: seller._id },
    { name: 'Terra Pot',       price: 700,  category: 'home-decor',  subcategory: 'Pots',      image: 'https://picsum.photos/seed/pot1/400/400',             description: 'Beautiful terra cotta pot.',                  stock: 9,  rating: 5, reviews: 15, sellerId: seller._id },
    { name: 'Table Lamp',      price: 1800, category: 'home-decor',  subcategory: 'Lighting',  image: 'https://picsum.photos/seed/lamp1/400/400',            description: 'Handmade table lamp.',                        stock: 4,  rating: 4, reviews: 9,  sellerId: seller._id },
    { name: 'Decorative Bowl', price: 600,  category: 'home-decor',  subcategory: 'Vases',     image: 'https://picsum.photos/seed/bowl1/400/400',            description: 'Decorative handmade bowl.',                   stock: 11, rating: 5, reviews: 33, sellerId: seller._id },
    { name: 'Woven Tote',      price: 1500, category: 'accessories', subcategory: 'Bags',      image: 'https://picsum.photos/seed/tote1/400/400',            description: 'Handwoven tote bag.',                         stock: 6,  rating: 5, reviews: 27, sellerId: seller._id },
    { name: 'Leather Bag',     price: 2200, category: 'accessories', subcategory: 'Bags',      image: 'https://picsum.photos/seed/bag1/400/400',             description: 'Handcrafted leather bag.',                    stock: 5,  rating: 4, reviews: 14, sellerId: seller._id },
    { name: 'Linen Scarf',     price: 450,  category: 'accessories', subcategory: 'Scarves',   image: 'https://picsum.photos/seed/scarf1/400/400',           description: 'Soft linen scarf.',                           stock: 20, rating: 5, reviews: 19, sellerId: seller._id },
    { name: 'Lavender Candle', price: 350,  category: 'candles',     subcategory: 'Scented',   image: 'https://picsum.photos/seed/candle1/400/400',          description: 'Hand-poured lavender candle.',                stock: 25, rating: 5, reviews: 41, sellerId: seller._id },
    { name: 'Vanilla Candle',  price: 380,  category: 'candles',     subcategory: 'Scented',   image: 'https://picsum.photos/seed/candle2/400/400',          description: 'Warm vanilla scented candle.',                stock: 20, rating: 4, reviews: 22, sellerId: seller._id },
    { name: 'Plain Pillar',    price: 250,  category: 'candles',     subcategory: 'Unscented', image: 'https://picsum.photos/seed/candle3/400/400',          description: 'Simple unscented pillar candle.',             stock: 30, rating: 4, reviews: 8,  sellerId: seller._id },
  ];

  await Product.deleteMany({});
  console.log('Cleared old products');
  
  await Product.insertMany(products);
  console.log('All products seeded successfully');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
