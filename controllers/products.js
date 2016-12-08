const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/* GET products page. */
router.get('/', (req, res) => {
  Product.find({}).then((products) => {
    res.render('products/index', { title: 'Products - FLAME Furniture Inc.', products: products });
  });
});

module.exports = router;