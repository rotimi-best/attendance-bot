const Group = require('../models/group')

const creator = () => {
  const someGroup = {
    name: 'Grpup 1',
    students: ['Celler', 'Bell Johnso'],
    owner: {
        telegramId: 54542,
        name: 'Bro'
    },
    spreadsheetLink: 'String.com',
    sheetName: 'Group 5'
  }; 
  
  Group.create(someGroup, (err, data) => {
    if (err) return console.log(`Some error while creating a new group ${err}`);
    console.log(data);
  });
}

// const db = require("./index");
// const {
//   DB_COLLECTIONS: { GROUPS }
// } = require("../helpers/constants");
// const collection = GROUPS;

// const addGroup = async groupData => {
//   groupData.collection = collection;

//   db.insert(groupData, (err, newDoc) => {
//     if (err) return "Error occured" + err;
//     console.log("New group created!");
//     return newDoc;
//   });
// };

// module.exports = {
//   addGroup
// };