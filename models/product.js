const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: String, // Little Jumbo, Klemenza...
  type: String, // baseline or signature
  category: String, // tables, chairs, lamps...
  size: [String],
  material: String,
  description: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;