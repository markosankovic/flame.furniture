const express = require('express');
const router = express.Router();
const mailer = require('nodemailer');

const debug = require('debug')('ff:server');

const co = require('co');
const mongo = require('../mongo');

router.use('/products', require('./products'));

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'FLAME Furniture Inc.' });
});

/* POST subscribe to newsletter and special offers. */
router.post('/subscribe', (req, res) => {
  co(function* () {
    let subscriber = yield mongo.db.collection('subscribers').findOne({ email: req.body.email });
    if (subscriber) {
      res.status(409).send('The provided email is already subscribed to our newsletters and special offers.');
    } else {
      mongo.db.collection('subscribers').insertOne({
        email: req.body.email,
        created_at: new Date()
      });
      res.send(200);
    }
  });
});

/* GET about page. */
router.get('/about', (req, res) => {
  res.render('about', { title: 'ABOUT - FLAME Furniture Inc.' });
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

  mongo.db.collection('contacts').insertOne({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
    created_at: new Date()
  });

  const transporter = mailer.createTransport(process.env.NODEMAILER_TRANSPORTER);

  const mail = {
    from: 'FLAME Furniture Inc. <flamefurniture@gmail.com>',
    to: process.env.MAIL_TO,
    subject: `flame.furniture contact with subject '${req.body.subject}'`,
    text: `${req.body.name} <${req.body.email}>\n\n${req.body.message}`
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