const express = require('express');
const rpn = require('request-promise-native');
const router = express.Router();
const fs = require('fs');
const sizeOf = require('image-size');
const mailer = require('nodemailer');

const debug = require('debug')('ff:server');

const mongo = require('../mongo');

// WARNING: read data from JSON files in order to avoid empty products when an unknown issue with MongoDB occurs
// TODO: let the issue with MongoDB occur and then inspect the container log
const _ = require('lodash');
const _products = require('../mongo-seed/products');
const _categories = require('../mongo-seed/categories');

/* GET products page. */
router.get('/:slug?', (req, res, next) => {
  if (req.params.slug) {
    let product = _.find(_products, { slug: req.params.slug });
    if (product) {
      product.category = _.find(_categories, { _id: product.category_id });
      const filenames = fs.readdirSync(`${__dirname}/../public/images/products/gallery/${product.slug}/`);
      product.gallery_count = filenames.filter(filename => filename.endsWith('jpg')).length / 2;
      res.render('products/product', { title: `${product.name} - FLAME Furniture Inc.`, description: req.__('description.products.product', product.name, req.__(`category.${product.category.name}`)), product: product });
    } else {
      let category = _.find(_categories, { slug: req.params.slug });
      if (req.params.slug === 'signature') {
        category = { '_id': '59ff37975d0bbd8610fe20a1', 'name': 'Signature line', 'slug': 'signature' };
      }
      if (category) {
        let products = _.filter(_products, { category_id: category._id });
        if (req.params.slug === 'signature') {
          products = _.filter(_products, { signature: true });
        } else {
          if (category.parent_id) {
            category.parent = _.find(_categories, { _id: category.parent_id });
            products = _.filter(_products, { category_id: category._id });
          } else {
            let subcategories = _.filter(_categories, { parent_id: category._id });
            let subcategoriesIds = subcategories.map(subcategory => subcategory._id);
            products = _.filter(_products, (product) => product.category_id === category._id || _.includes(subcategoriesIds, product.category_id));
          }
        }
        for (let product of products) {
          product.category = _.find(_categories, { _id: product.category_id });
          const dimensions = sizeOf(`${__dirname}/../public/images/products/featured/${product.slug}.jpg`);
          product.featured_image_layout = dimensions.width > dimensions.height ? 'landscape' : 'portrait';
        }
        res.render('products/index', { title: `${category.name} - FLAME Furniture Inc.`, description: req.__('description.products.category', req.__(`category.${category.name}`)), category: category, products: products });
      } else {
        res.status(404);
        next();
      }
    }
  } else {
    let products = _.sortBy(_products, 'name').map(product => {
      product.category = _.find(_categories, { _id: product.category_id });
      const dimensions = sizeOf(`${__dirname}/../public/images/products/featured/${product.slug}.jpg`);
      product.featured_image_layout = dimensions.width > dimensions.height ? 'landscape' : 'portrait';
      return product;
    });
    res.render('products/index', { title: `${req.__('PRODUCTS')} - FLAME Furniture Inc.`, description: req.__('description.products.index'), products: products });
  }
});

/* GET product inquiry page. */
router.get('/:slug/buy', (req, res) => {
  if (req.params.slug) {
    let product = _.find(_products, { slug: req.params.slug });
    if (product) {
      product.category = _.find(_categories, { _id: product.category_id });
      res.render('products/buy', { title: `${req.__('BUY')} ${product.name} - FLAME Furniture Inc.`, description: req.__('description.products.buy', product.name), product: product });
    }
  }
});

/* POST product inquiry send action. */
router.post('/:slug/buy/send', (req, res) => {

  const recaptchaSecret = process.env['RECAPTCHA_SECRET'];
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

  rpn(verificationUrl).then(body => {
    let verificationData = JSON.parse(body);
    if (verificationData['success']) {
      let product = _.find(_products, { slug: req.params.slug });
      if (product) {
        const productUrl = req.protocol + '://' + req.get('host') + `/products/${product.slug}`;

        const transporter = mailer.createTransport(process.env['NODEMAILER_TRANSPORTER']);

        const mail = {
          from: 'FLAME Furniture Inc. <flamefurniture@gmail.com>',
          to: process.env['MAIL_TO'],
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

        mongo.db.collection('inquiries').insertOne({
          name: req.body.name,
          email: req.body.email,
          message: req.body.message,
          product: product,
          created_at: new Date()
        });
      }
    }
  }).catch(err => {
    console.log('ERR: ', err);
  });
});

module.exports = router;