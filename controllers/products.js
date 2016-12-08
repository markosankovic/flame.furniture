const express = require('express');
const _ = require('lodash');
const router = express.Router();
const Product = require('../models/product');

/* GET products page. */
router.get('/', (req, res) => {
  res.render('products/index', { title: 'Products - FLAME Furniture Inc.' });
});

/* GET products type (baseline or signature) page. */
router.get('/:type(baseline|signature)', (req, res) => {
  Product.find({}).then((products) => {
    res.render('products/type', { title: `${_.capitalize(req.params.type)} products - FLAME Furniture Inc.`, type: req.params.type, products: products });
  });
});

/* GET products categories page. */
router.get('/:type(baseline|signature)/:slug', (req, res) => {
  res.render('products/category', { title: `${_.capitalize(req.params.slug)} ${req.params.type} products - FLAME Furniture Inc.`, type: req.params.type, category: { name: req.params.slug } });
});

/* GET single product page. */
router.get('/:slug', (req, res) => {
  res.render('products/product', { title: `${_.capitalize(req.params.type)} products - FLAME Furniture Inc.`, product: { name: req.params.slug, type: 'baseline' } });
});

module.exports = router;