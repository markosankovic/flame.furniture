var express = require('express');
var router = express.Router();
var mailer = require("nodemailer");

var debug = require('debug')('flame.furniture:server');

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

/* POST contact send. */
router.post('/contact/send', function (req, res, next) {

  var transporter = mailer.createTransport(process.env.NODEMAILER_TRANSPORTER);

  var mail = {
    from: "FLAME Furniture Inc. <flamefurniture@gmail.com>",
    to: process.env.MAIL_TO,
    subject: "flame.furniture: " + req.body.subject,
    text: req.body.name + " <" + req.body.email + ">\n\n" + req.body.message
  };

  transporter.sendMail(mail, function (error, response) {
    if (error) {
      debug(error);
      res.status(500).json({ success: false });
    } else {
      debug(response);
      res.json({ success: true });
    }
    transporter.close();
  });
});

module.exports = router;