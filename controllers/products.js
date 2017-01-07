const express = require('express');
const router = express.Router();

const co = require('co');
const mongo = require('../mongo');

/* GET products page. */
router.get('/:slug?', (req, res) => {
  co(function* () {
    const locale = req.getLocale();

    let categories = yield mongo.db.collection('categories').find({ parent_id: { $exists: false }, locale: locale }).toArray();
    for (let category of categories) {
      category.subcategories = yield mongo.db.collection('categories').find({ parent_id: category._id }).toArray();
    }

    if (req.params.slug) {
      let product = yield mongo.db.collection('products').findOne({ slug: req.params.slug, locale: locale });
      if (product) {
        product.category = yield mongo.db.collection('categories').findOne({ _id: product.category_id });
        res.render('products/product', { title: `${product.name} - FLAME Furniture Inc.`, categories: categories, product: product });
      } else {
        let category = yield mongo.db.collection('categories').findOne({ slug: req.params.slug, locale: locale });
        let products = mongo.db.collection('products').find();
        if (category.parent_id) {
          category.parent = yield mongo.db.collection('categories').findOne({ _id: category.parent_id });
          products = yield products.filter({ category_id: category._id }).toArray();
        } else {
          let subcategories = yield mongo.db.collection('categories').find({ parent_id: category._id }, ['_id']).toArray();
          let subcategoriesIds = subcategories.map(subcategory => subcategory._id);
          products = yield products.filter({ category_id: { $in: subcategoriesIds } }).toArray();
        }
        for (let product of products) {
          product.category = yield mongo.db.collection('categories').findOne({ _id: product.category_id });
        }
        res.render('products/index', { title: `${category.name} - FLAME Furniture Inc.`, categories: categories, category: category, products: products });
      }
    } else {
      let products = yield mongo.db.collection('products').find({ locale: locale }).toArray();
      for (let product of products) {
        product.category = yield mongo.db.collection('categories').findOne({ _id: product.category_id });
      }
      res.render('products/index', { title: 'Products - FLAME Furniture Inc.', categories: categories, products: products });
    }
  });
});

module.exports = router;