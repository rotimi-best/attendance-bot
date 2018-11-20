const Datastore = require("nedb-promises");

const db = Datastore.create({
  filename: "db.db",
  timestampData: true,
  autoload: true
});

module.exports = db;
