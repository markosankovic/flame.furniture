const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  type: String, // baseline or signature
  category: String, // tables, chairs, lamps...
  name: String, // Little Jumbo, Klemenza...
  size: String,
  material: String,
  description: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;