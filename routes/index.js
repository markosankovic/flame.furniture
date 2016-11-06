var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'FLAME Furniture Inc.' });
});

/* GET about page. */
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'ABOUT - FLAME Furniture Inc.' });
});

/* GET shop page. */
router.get('/shop', function (req, res, next) {
  res.render('shop', { title: 'SHOP - FLAME Furniture Inc.' });
});

/* GET gallery page. */
router.get('/gallery', function (req, res, next) {
  res.render('gallery', { title: 'GALLERY - FLAME Furniture Inc.' });
});

/* GET home page. */
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'CONTACT - FLAME Furniture Inc.' });
});

module.exports = router;