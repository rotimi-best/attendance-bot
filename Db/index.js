const Datastore = require("nedb-promises");

const db = Datastore.create({
  filename: "Data/db.db",
  timestampData: true,
  autoload: true
});

module.exports = db;
