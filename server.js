const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
// Allow CORS for cross-origin requests
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

// Inventory Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  barcode: { type: String, required: true, unique: true }, // Ensure barcode is unique
});

const Product = mongoose.model('Product', productSchema);

// Create new product with barcode generation
app.post('/product', async (req, res) => {
  const { name, price, quantity, barcode } = req.body;

  if (!name || !price || !quantity || !barcode) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newProduct = new Product({ name, price, quantity, barcode });
  try {
    await newProduct.save();
    res.status(201).json(newProduct); // Send status 201 for resource creation
  } catch (error) {
    if (error.code === 11000) { // Duplicate barcode error
      res.status(400).json({ error: 'Product with this barcode already exists' });
    } else {
      res.status(500).json({ error: 'Error saving product' });
    }
  }
});

// Fetch all products (for Inventory)
app.get('/inventory', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Update product quantity (for POS)
app.get('/pos/:barcode', async (req, res) => {
  const { barcode } = req.params;
  try {
    const product = await Product.findOne(
      { barcode }
    );
    console.log(product);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});


app.put('/pos/:barcode', async (req, res) => {
  const { barcode } = req.params;
  const { quantity } = req.body;

  try {
    const product = await Product.findOneAndUpdate({ barcode: barcode }, { quantity }, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error Updating Product' });
  }
})

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
