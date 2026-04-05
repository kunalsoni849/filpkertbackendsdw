const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;  // ← Change 1

// ← Change 2: CORS allow all
app.use(cors({
  origin: '*'
}));
app.use(express.json());

const productsFilePath = path.join(__dirname , 'products.json');

const readProducts = () => {
  const data = fs.readFileSync(productsFilePath, 'utf8');
  return JSON.parse(data);
};

// GET: All products
app.get('/api/products', (req, res) => {
  try {
    const data = readProducts();
    console.log("Products loaded:", data.products.length);
    res.status(200).json({
      success: true,
      count: data.products.length,
      products: data.products
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
});

// GET: Single product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const data = readProducts();
    const productId = req.params.id;
    console.log("Searching for product with id:", productId);
    
    const product = data.products.find(p => p.id === productId);
    
    if (!product) {
      console.log("Product NOT found for id:", productId);
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    console.log("Product found:", product.name);
    res.status(200).json({
      success: true,
      product: product
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`
  🚀 Server running on port ${PORT}
  📦 API: GET /api/products
  📦 API: GET /api/products/:id
  `);
});