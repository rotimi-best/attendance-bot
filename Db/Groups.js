const db = require("./index");
const {
  DB_COLLECTIONS: { GROUPS }
} = require("../helpers/constants");
const collection = GROUPS;

const addGroup = async groupData => {
  groupData.collection = collection;

  db.insert(groupData, (err, newDoc) => {
    if (err) return "Error occured" + err;
    console.log("New group created!");
    return newDoc;
  });
};

module.exports = {
  addGroup
};
