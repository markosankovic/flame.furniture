const express = require('express');
const router = express.Router();
const fs = require('fs');
const sizeOf = require('image-size');
const mailer = require('nodemailer');

const debug = require('debug')('ff:server');

const co = require('co');
const mongo = require('../mongo');

/* GET products page. */
router.get('/:slug?', (req, res) => {
  co(function* () {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    let categories = yield mongo.db.collection('categories').find({ parent_id: { $exists: false } }).toArray();
    for (let category of categories) {
      category.subcategories = yield mongo.db.collection('categories').find({ parent_id: category._id }).toArray();
    }

    if (req.params.slug) {
      let product = yield mongo.db.collection('products').findOne({ slug: req.params.slug });
      if (product) {
        product.category = yield mongo.db.collection('categories').findOne({ _id: product.category_id });
        const filenames = fs.readdirSync(`${__dirname}/../public/images/products/gallery/${product.slug}/`);
        product.gallery_count = filenames.filter(filename => filename.endsWith('jpg')).length / 2;
        res.render('products/product', { title: `${product.name} - FLAME Furniture Inc.`, categories: categories, product: product, fullUrl: fullUrl });
      } else {
        let category = yield mongo.db.collection('categories').findOne({ slug: req.params.slug });
        let products = mongo.db.collection('products').find().sort({ name: 1 });
        if (category.parent_id) {
          category.parent = yield mongo.db.collection('categories').findOne({ _id: category.parent_id });
          products = yield products.filter({ category_id: category._id }).toArray();
        } else {
          let subcategories = yield mongo.db.collection('categories').find({ parent_id: category._id }, ['_id']).toArray();
          let subcategoriesIds = subcategories.map(subcategory => subcategory._id);
          products = yield products.filter({ $or: [{ category_id: category._id }, { category_id: { $in: subcategoriesIds } }] }).toArray();
        }
        for (let product of products) {
          product.category = yield mongo.db.collection('categories').findOne({ _id: product.category_id });
          const dimensions = sizeOf(`${__dirname}/../public/images/products/featured/${product.slug}.jpg`);
          product.featured_image_layout = dimensions.width > dimensions.height ? 'landscape' : 'portrait';
        }
        res.render('products/index', { title: `${category.name} - FLAME Furniture Inc.`, categories: categories, category: category, products: products, fullUrl: fullUrl });
      }
    } else {
      let products = yield mongo.db.collection('products').find().sort({ name: 1 }).toArray();
      for (let product of products) {
        product.category = yield mongo.db.collection('categories').findOne({ _id: product.category_id });
        const dimensions = sizeOf(`${__dirname}/../public/images/products/featured/${product.slug}.jpg`);
        product.featured_image_layout = dimensions.width > dimensions.height ? 'landscape' : 'portrait';
      }
      res.render('products/index', { title: 'Products - FLAME Furniture Inc.', categories: categories, products: products, fullUrl: fullUrl });
    }
  });
});

/* GET product inquiry page. */
router.get('/:slug/buy', (req, res) => {
  co(function* () {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    let categories = yield mongo.db.collection('categories').find({ parent_id: { $exists: false } }).toArray();
    for (let category of categories) {
      category.subcategories = yield mongo.db.collection('categories').find({ parent_id: category._id }).toArray();
    }

    if (req.params.slug) {
      let product = yield mongo.db.collection('products').findOne({ slug: req.params.slug });
      if (product) {
        product.category = yield mongo.db.collection('categories').findOne({ _id: product.category_id });
        res.render('products/buy', { title: `Buy ${product.name} - FLAME Furniture Inc.`, categories: categories, product: product, fullUrl: fullUrl });
      }
    }
  });
});

/* POST product inquiry send action. */
router.post('/:slug/buy/send', (req, res) => {

  co(function* () {
    let product = yield mongo.db.collection('products').findOne({ slug: req.params.slug });
    if (product) {

      mongo.db.collection('inquiries').insertOne({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        product: product,
        created_at: new Date()
      });

      const productUrl = req.protocol + '://' + req.get('host') + `/products/${product.slug}`;

      const transporter = mailer.createTransport(process.env.NODEMAILER_TRANSPORTER);

      const mail = {
        from: 'FLAME Furniture Inc. <flamefurniture@gmail.com>',
        to: process.env.MAIL_TO,
        subject: `flame.furniture inquiry for ${product.name}`,
        text: `${req.body.name} <${req.body.email}>\n\n${product.name}\n${productUrl}\n\n${req.body.message}`
      };

      transporter.sendMail(mail, (error, response) => {
        if (error) {
          debug(error);
          res.status(500).json({ success: false });
        } else {
          debug(response);
          res.json({ success: true });
        }
        transporter.close();
      });
    }
  });
});

module.exports = router;