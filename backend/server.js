const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/automation", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log(' Connected to MongoDB'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// Define MongoDB Schemas
const productSchema = new mongoose.Schema({
  productId: { type: String },
  productName: { type: String },
  batchId: { type: String },
  timestamp: { type: Date },
  quantity: { type: Number },
  weight: { type: Number}
});

const rackSchema = new mongoose.Schema({
  rackId: { type: String},
  products: [productSchema],
  maxCapacity: { type: Number }
});

const Rack = mongoose.model('Rack', rackSchema);
const Product = mongoose.model("Product", productSchema);

app.post("/api/racks/add-product", async (req, res) => {
  try {
    const { rackId, productId, quantity, weight } = req.body;
    const timestamp = new Date();

    // Input validation
    if (!rackId || !productId || isNaN(quantity) || quantity <= 0 || isNaN(weight) || weight <= 0) {
      return res.status(400).json({ message: "Invalid input. Check rackId, productId, quantity, and weight." });
    }

    // Check if product exists globally
    const existingProduct = await Product.findOne({ productId });
    if (!existingProduct) {
      return res.status(400).json({ message: "Product ID does not exist in the product database." });
    }

    const productName = existingProduct.productName;

    // Check if requested rack exists
    const rack = await Rack.findOne({ rackId });
    if (!rack) {
      return res.status(404).json({ message: "Rack not found" });
    }

    // Calculate total weight already in rack
    const totalCurrentWeight = rack.products.reduce((sum, product) => sum + product.weight, 0);

    // Check rack capacity
    if (totalCurrentWeight + weight > rack.maxCapacity) {
      return res.status(400).json({ message: "Rack capacity exceeded" });
    }

    // ✅ Check if any other rack already has the same product and enough space
    const availableRack = await Rack.findOne({
      "products.productId": productId,
    });

    if (availableRack && availableRack.rackId !== rackId) {
      const availableRackCurrentWeight = availableRack.products.reduce((sum, product) => sum + product.weight, 0);
      const availableRackRemainingCapacity = availableRack.maxCapacity - availableRackCurrentWeight;

      if (availableRackRemainingCapacity >= weight) {
        return res.status(400).json({
          message: `Another rack (${availableRack.rackId}) already contains this product and has space. Use that rack instead.`,
        });
      }
    }

    const existingRackProduct = rack.products.find(p => p.productId === productId);

    if (existingRackProduct) {
      existingRackProduct.quantity += quantity;
      existingRackProduct.weight += weight;
      existingProduct.timestamp = timestamp;
    } else {
      if (rack.products.length > 0) {
        return res.status(400).json({ message: "Invalid productId for this rack" });
      }

      rack.products.push({ productId, productName, quantity, weight , timestamp});
    }

    await rack.save();

    res.json({ message: "Product added successfully", rack });

  } catch (error) {
    console.error("Error in /api/racks/add-product:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.post("/api/products/register", async (req, res) => {
  const { productId, productName } = req.body;

  if (!productId || !productName ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).json({ message: "Product ID already exists." });
    }
    const existingProductName = await Product.findOne({ productName });
    if (existingProductName) {
      return res.status(400).json({ message: "Product Name already exists." });
    }


    const newProduct = new Product({ productId, productName });

    await newProduct.save();

    res.status(201).json({ message: "Product registered successfully.", product: newProduct });
  } catch (error) {
    console.error("Error registering product:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

app.delete("/api/racks/remove-stock", async (req, res) => {
  const { productId, weight, quantity } = req.body;

  if (!productId || isNaN(weight) || weight <= 0 || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ message: "Invalid input. Please check productId, weight, and quantity." });
  }

  try {
    const racks = await Rack.find({ "products.productId": productId });

    if (racks.length === 0) {
      return res.status(404).json({ message: "Product not found in any rack." });
    }

    let matchingProducts = [];

    for (let rack of racks) {
      for (let product of rack.products) {
        if (product.productId === productId) {
          matchingProducts.push({
            rack,
            product,
            timestamp: product.timestamp,
          });
        }
      }
    }

    // Sort by timestamp (FIFO)
    matchingProducts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    let remainingQty = quantity;
    let remainingWeight = weight;
    const perRackQtyMap = new Map(); // New: Track how much removed per rack

    for (let entry of matchingProducts) {
      if (remainingQty <= 0 && remainingWeight <= 0) break;

      const rack = entry.rack;
      const product = entry.product;

      const removeQty = Math.min(product.quantity, remainingQty);
      const removeWeight = Math.min(product.weight, remainingWeight);

      product.quantity -= removeQty;
      product.weight -= removeWeight;

      remainingQty -= removeQty;
      remainingWeight -= removeWeight;

      // Track removed quantity per rack
      perRackQtyMap.set(
        rack.rackId,
        (perRackQtyMap.get(rack.rackId) || 0) + removeQty
      );

      // Remove product entry if quantity is 0
      rack.products = rack.products.filter(p => !(p.productId === productId && p.quantity === 0));

      await rack.save();
    }

    if (remainingQty > 0 || remainingWeight > 0) {
      return res.status(400).json({ message: "Not enough stock to fulfill the request." });
    }

    // Build summary
    const removalSummary = Array.from(perRackQtyMap.entries()).map(([rackId, qty]) => ({
      rackId,
      quantityRemoved: qty
    }));

    res.status(200).json({
      message: `Stock removed successfully.`,
      removalSummary
    });

  } catch (error) {
    console.error("Error removing stock:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});


app.post('/data', async (req, res) => {
  const { id, weight } = req.body;

  try {
    const updatedItem = await Rack.findOneAndUpdate(
      { "products.productId": id },
      { $set: { "products.$.weight": weight } },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    res.json({ message: "✅ Data updated successfully", updatedItem });
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating data", error: err.message });
  }

  console.log('📡 Data received from ESP32:', req.body);
});

// 📌 Fetch All Racks and Products
app.get('/getdata', async (req, res) => {
  try {
    const racks = await Rack.find();
    res.json(racks);
  } catch (error) {
    res.status(500).json({ error: '❌ Error fetching data' });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
