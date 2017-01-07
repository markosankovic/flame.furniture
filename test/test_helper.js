const ObjectID = require('mongodb').ObjectID;
const mongo = require('../mongo');
const categories = require('../mongo-seed/categories');

before(function (done) {
  mongo.connect('mongodb://localhost:27017', function () {
    done();
  });
});

beforeEach(function (done) { mongo.db.collection('categories').deleteMany({}, done); });
beforeEach(function (done) {
  mongo.db.collection('categories').insertMany(categories, done);
});