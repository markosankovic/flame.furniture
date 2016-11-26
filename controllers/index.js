const express = require('express');
const router = express.Router();
const mailer = require('nodemailer');

const debug = require('debug')('flame.furniture:server');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'FLAME Furniture Inc.' });
});

/* GET about page. */
router.get('/about', (req, res) => {
  res.render('about', { title: 'ABOUT - FLAME Furniture Inc.' });
});

/* GET shop page. */
router.get('/shop', (req, res) => {
  res.render('shop', { title: 'SHOP - FLAME Furniture Inc.' });
});

/* GET gallery page. */
router.get('/gallery', (req, res) => {
  res.render('gallery', { title: 'GALLERY - FLAME Furniture Inc.' });
});

/* GET home page. */
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'CONTACT - FLAME Furniture Inc.' });
});

/* POST contact send. */
router.post('/contact/send', (req, res) => {

  const transporter = mailer.createTransport(process.env.NODEMAILER_TRANSPORTER);

  const mail = {
    from: 'FLAME Furniture Inc. <flamefurniture@gmail.com>',
    to: process.env.MAIL_TO,
    subject: 'flame.furniture: ' + req.body.subject,
    text: req.body.name + ' <' + req.body.email + '>\n\n' + req.body.message
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
});

module.exports = router;