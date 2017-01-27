const express = require('express');
const i18n = require('i18n');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const expressHelpers = require('express-helpers');
const mongo = require('./mongo');

require('dotenv').config(); // load environment variables from a .env file into process.env

const app = express();

// helpers
expressHelpers(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure locales
i18n.configure({
  locales: ['en', 'sr'],
  defaultLocale: 'en',
  cookie: 'locale',
  directory: __dirname + '/locales'
});

// i18n init parses req for language headers, cookies, etc.
app.use((req, res, next) => {
  i18n.init(req, res, next);
});

// app.locals
app.locals.productDimension = function (dimension, __) {
  return Object.keys(dimension).map((key) => `${__('product.dimension.' + key)}: ${dimension[key]} cm`).join(', ');
};

app.locals.productMaterial = function (material, __) {
  return material.map(val => __('product.material.' + val)).join(', ');
};

// connect to mongodb
mongo.connect('mongodb://mongo:27017/ff');

app.use(require('./controllers'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;