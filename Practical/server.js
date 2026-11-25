const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


let products = [
  { id: 1, sku: 'LAP-001', name: 'Wireless Mouse', category: 'Electronics', price: 25.99, quantity: 50, minStock: 10 },
  { id: 2, sku: 'KEY-002', name: 'Mechanical Keyboard', category: 'Electronics', price: 79.99, quantity: 8, minStock: 10 }
];
let nextId = 3;

app.get('/api/products', (req, res) => {
  let result = [...products];

  if (req.query.category) {
    result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
  }

  if (req.query.lowStock === 'true') {
    result = result.filter(p => p.quantity <= p.minStock);
  }

  res.json(result);
});


app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});


app.post('/api/products', (req, res) => {
  const { sku, name, category, price, quantity, minStock } = req.body;

  if (!sku || !name || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'SKU, name, price, and quantity are required' });
  }


  const newProduct = {
    id: nextId++,
    name,
    category: category || 'Uncategorized',
    price: Number(price),
    quantity: Number(quantity),
    minStock: minStock !== undefined ? Number(minStock) : 5
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});


app.patch('/api/products/:id/stock', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { adjustment } = req.body;
  if (typeof adjustment !== 'number') {
    return res.status(400).json({ error: 'Adjustment must be a number' });
  }

  if (product.quantity + adjustment < 0) {
    return res.status(400).json({ error: 'Insufficient stock for this deduction' });
  }

  product.quantity += adjustment;
  res.json({
    message: 'Stock updated successfully',
    product,
    lowStockAlert: product.quantity <= product.minStock
  });
});

app.put('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { sku, name, category, price, quantity, minStock } = req.body;
  if (sku !== undefined) product.sku = sku;
  if (name !== undefined) product.name = name;
  if (category !== undefined) product.category = category;
  if (price !== undefined) product.price = Number(price);
  if (quantity !== undefined) product.quantity = Number(quantity);
  if (minStock !== undefined) product.minStock = Number(minStock);

  res.json(product);
});


app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted', product: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Inventory server running on http://localhost:${PORT}`);
});