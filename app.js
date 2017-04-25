const express = require('express');
const i18n = require('i18n');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const expressHelpers = require('express-helpers');
const co = require('co');
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

// use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// application middleware
app.use(function (req, res, next) {
  co(function* () {
    let categories = yield mongo.db.collection('categories').find({ parent_id: { $exists: false } }).toArray();
    for (let category of categories) {
      category.subcategories = yield mongo.db.collection('categories').find({ parent_id: category._id }).toArray();
    }
    app.locals.categories = categories;
    next();
  });
});

app.use(function (req, res, next) {
  app.locals.baseUrl = `${req.protocol}://${req.get('host')}`;
  app.locals.fullUrl = `${app.locals.baseUrl}${req.originalUrl}`;
  next();
});

// load all files in controllers directory
app.use(require('./controllers'));

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

app.use((req, res) => {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', {
      url: req.url,
      title: 'FLAME Furniture Inc. - PAGE NOT FOUND',
      description: 'The page you are looking for is caught in FLAME'
    });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain text
  res.type('txt').send('Not found');
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