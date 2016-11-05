var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'FLAME FURNITURE INC.' });
});

/* GET about page. */
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'ABOUT :: FLAME FURNITURE INC.' });
});

/* GET shop page. */
router.get('/shop', function (req, res, next) {
  res.render('shop', { title: 'SHOP :: FLAME FURNITURE INC.' });
});

/* GET gallery page. */
router.get('/gallery', function (req, res, next) {
  res.render('gallery', { title: 'GALLERY :: FLAME FURNITURE INC.' });
});

/* GET home page. */
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'CONTACT :: FLAME FURNITURE INC.' });
});

module.exports = router;