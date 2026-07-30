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
    // Clothing
    { name: 'Vintage Denim Jacket', price: 1800, category: 'clothing', subcategory: 'Tops',    image: 'https://picsum.photos/seed/denim-jacket/400/400', description: 'Classic pre-loved denim jacket, gently worn.', stock: 3,  condition: 'Good',     rating: 4, reviews: 12, sellerId: seller._id, status: 'approved' },
    { name: 'Cotton Blouse',        price: 900,  category: 'clothing', subcategory: 'Tops',    image: 'https://picsum.photos/seed/cotton-blouse/400/400', description: 'Soft cotton blouse, like new.',                stock: 5,  condition: 'Like New', rating: 5, reviews: 8,  sellerId: seller._id, status: 'approved' },
    { name: 'High-Waist Jeans',     price: 1200, category: 'clothing', subcategory: 'Bottoms', image: 'https://picsum.photos/seed/hw-jeans/400/400',      description: 'High-waist jeans, barely worn.',               stock: 4,  condition: 'Like New', rating: 4, reviews: 15, sellerId: seller._id, status: 'approved' },
    { name: 'Linen Trousers',       price: 1100, category: 'clothing', subcategory: 'Bottoms', image: 'https://picsum.photos/seed/linen-trousers/400/400',description: 'Breathable linen trousers.',                   stock: 6,  condition: 'Good',     rating: 4, reviews: 9,  sellerId: seller._id, status: 'approved' },
    { name: 'Floral Summer Dress',  price: 1500, category: 'clothing', subcategory: 'Dresses', image: 'https://picsum.photos/seed/floral-dress/400/400',  description: 'Light floral dress, perfect for summer.',      stock: 2,  condition: 'Good',     rating: 5, reviews: 21, sellerId: seller._id, status: 'approved' },

    // Furniture
    { name: 'Rattan Accent Chair',  price: 4500, category: 'furniture', subcategory: 'Chairs',  image: 'https://picsum.photos/seed/rattan-chair/400/400',  description: 'Handwoven rattan accent chair.',              stock: 1, condition: 'Good',     rating: 5, reviews: 6,  sellerId: seller._id, status: 'approved' },
    { name: 'Wooden Dining Table',  price: 8500, category: 'furniture', subcategory: 'Tables',  image: 'https://picsum.photos/seed/dining-table/400/400',  description: 'Solid wood dining table, seats four.',        stock: 1, condition: 'Fair',     rating: 4, reviews: 3,  sellerId: seller._id, status: 'approved' },
    { name: 'Storage Ottoman',      price: 2200, category: 'furniture', subcategory: 'Storage', image: 'https://picsum.photos/seed/storage-ottoman/400/400', description: 'Upholstered ottoman with hidden storage.', stock: 3, condition: 'Good',     rating: 4, reviews: 11, sellerId: seller._id, status: 'approved' },
    { name: 'Wooden Storage Chest', price: 3200, category: 'furniture', subcategory: 'Storage', image: 'https://picsum.photos/seed/storage-chest/400/400', description: 'Rustic wooden storage chest.',                stock: 2, condition: 'Good',     rating: 5, reviews: 7,  sellerId: seller._id, status: 'approved' },

    // Books
    { name: 'The Great Gatsby (Used)', price: 350, category: 'books', subcategory: 'Fiction',      image: 'https://picsum.photos/seed/gatsby/400/400',       description: 'Well-loved paperback copy.',           stock: 4,  condition: 'Fair',     rating: 4, reviews: 10, sellerId: seller._id, status: 'approved' },
    { name: 'Atomic Habits',           price: 600, category: 'books', subcategory: 'Non-Fiction',  image: 'https://picsum.photos/seed/atomic-habits/400/400',description: 'Popular self-help book, great condition.', stock: 3,  condition: 'Like New', rating: 5, reviews: 18, sellerId: seller._id, status: 'approved' },
    { name: 'Kids Storybook Set',      price: 800, category: 'books', subcategory: "Children's",   image: 'https://picsum.photos/seed/storybook-set/400/400',description: 'Set of 3 illustrated storybooks.',      stock: 5,  condition: 'Good',     rating: 5, reviews: 14, sellerId: seller._id, status: 'approved' },

    // Accessories
    { name: 'Woven Tote Bag',   price: 1500, category: 'accessories', subcategory: 'Bags',    image: 'https://picsum.photos/seed/tote-bag/400/400',   description: 'Handwoven tote, gently used.',   stock: 6,  condition: 'Good',     rating: 5, reviews: 27, sellerId: seller._id, status: 'approved' },
    { name: 'Leather Crossbody', price: 2200, category: 'accessories', subcategory: 'Bags',    image: 'https://picsum.photos/seed/leather-bag/400/400', description: 'Compact leather crossbody bag.', stock: 3,  condition: 'Like New', rating: 4, reviews: 14, sellerId: seller._id, status: 'approved' },
    { name: 'Linen Scarf',       price: 450,  category: 'accessories', subcategory: 'Scarves', image: 'https://picsum.photos/seed/linen-scarf/400/400', description: 'Soft, breathable linen scarf.', stock: 8,  condition: 'Good',     rating: 5, reviews: 19, sellerId: seller._id, status: 'approved' },

    // Home Goods
    { name: 'Ceramic Vase',      price: 1200, category: 'home-goods', subcategory: 'Decor',       image: 'https://picsum.photos/seed/ceramic-vase/400/400', description: 'Handcrafted ceramic vase.',         stock: 4,  condition: 'Good',     rating: 4, reviews: 20, sellerId: seller._id, status: 'approved' },
    { name: 'Cast Iron Skillet', price: 900,  category: 'home-goods', subcategory: 'Kitchenware', image: 'https://picsum.photos/seed/skillet/400/400',      description: 'Well-seasoned cast iron skillet.', stock: 5,  condition: 'Good',     rating: 5, reviews: 24, sellerId: seller._id, status: 'approved' },
    { name: 'Cotton Throw Blanket', price: 700, category: 'home-goods', subcategory: 'Textiles', image: 'https://picsum.photos/seed/throw-blanket/400/400', description: 'Cozy cotton throw blanket.',      stock: 7,  condition: 'Good',     rating: 4, reviews: 16, sellerId: seller._id, status: 'approved' },
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