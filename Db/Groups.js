const Group = require("../models/group");

const addGroup = data => {
  return new Promise(async (resolve, reject) => {
    if (Array.isArray(data) && data.length) {
      Group.insertMany(data, (err, res) => {
        if (err) reject(`Error while creating array: ${err}`);

        resolve(res);
      });
    } else {
      Group.create(data, (err, res) => {
        if (err) reject(`Error while creating one Group: ${err}`);

        resolve(res);
      });
    }
  });
};

const findGroup = params => {
  return new Promise((resolve, reject) => {
    Group.find(params, (err, Groups) => {
      if (err) reject(`Error while finding Group ${err}`);

      resolve(Groups);
    });
  });
};

const updateGroup = (findField, setField) => {
  return new Promise((resolve, reject) => {
    Group.update(findField, { $set: setField }, (err, res) => {
      if (err) reject(`Error updating a Group field ${err}`);

      resolve(res);
    });
  });
};

const deleteGroup = findField => {
  return new Promise(async (resolve, reject) => {});
};

module.exports = {
  addGroup,
  findGroup,
  updateGroup,
  deleteGroup
};
