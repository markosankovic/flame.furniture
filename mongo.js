let MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');

module.exports.connect = function (uri, callback) {
  co(function* () {
    let db = yield MongoClient.connect(uri);
    console.log('Connected correctly to server');
    module.exports.db = db;
    if (callback) callback(db);
  }).catch(function (err) {
    console.log(err.stack);
  });
};