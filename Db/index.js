const Datastore = require('nedb-promises');

const db = Datastore.create('db.db');

module.exports = db;