const co = require('co');
const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:3001');

const helper = require('./test_helper');
const mongo = require('../mongo');

describe('categories', function () {

  it('should find category by slug', function (done) {
    co(function* () {
      let category = yield mongo.db.collection('categories').findOne({ slug: 'dining-tables' });
      expect(category._id).to.equal('586e5350ac8b94a3c6d6285d');
      expect(category.name).to.equal('Dining Tables');
      done();
    }).catch(console.log);
  });

  it('should find all categories having no parent', function (done) {
    co(function* () {
      let categories = yield mongo.db.collection('categories').find({ parent_id: { $exists: false } }).toArray();
      expect(categories).to.have.lengthOf(7);
      done();
    }).catch(console.log);
  });

  it('should find all subcategories for parent category', function (done) {
    co(function* () {
      let category = yield mongo.db.collection('categories').findOne({ _id: '586e46b9c0221c321bbfb1a3' });
      let subcategories = yield mongo.db.collection('categories').find({ parent_id: category._id }).toArray();
      expect(subcategories).to.have.lengthOf(3);
      done();
    }).catch(console.log);
  });

  it('should find and group categories and subcategories', function (done) {
    co(function* () {
      let categories = yield mongo.db.collection('categories').find({ parent_id: { $exists: false } }).toArray();
      for (let category of categories) {
        category.subcategories = yield mongo.db.collection('categories').find({ parent_id: category._id }).toArray();
      }
      done();
    }).catch(console.log);
  });
});