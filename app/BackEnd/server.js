const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/automation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Product Schema
const productSchema = new mongoose.Schema({
  product_id: String,
  product_name: String,
  weight: String,
  qty: Number,
  rack_id: String,
});

const Product = mongoose.model('Product', productSchema);

// Add product with rack
app.post('/add-product', async (req, res) => {
  try {
    const { product_id, product_name, weight, qty, rack_id } = req.body;
    console.log("add");
    console.log(req.body);
    // Validate required fields
    if (!product_id || !product_name || !weight || !qty || !rack_id) {
      return res.status(400).json({ error: 'All fields are required: product_id, product_name, weight, qty, rack_id' });
    }
    // Optional: Prevent duplicate product_id
    const existing = await Product.findOne({ product_id });
    if (existing) {
      return res.status(409).json({ error: 'Product with this product_id already exists.' });
    }
    // Create and save product
    const product = new Product({ product_id, product_name, weight, qty, rack_id });
    await product.save();
    // Return the saved product in clean JSON
    res.status(201).json({ message: 'Product added', product: product.toObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove product by product_id and rack_id
app.post('/remove-product', async (req, res) => {
  try {
    const { product_id, rack_id } = req.body;
    console.log("remove:")
    console.log(req.body);
    if (!product_id || !rack_id) {
      return res.status(400).json({ error: 'product_id and rack_id are required.' });
    }
    const result = await Product.deleteOne({ product_id, rack_id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found in the specified rack.' });
    }
    res.json({ message: 'Product removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 