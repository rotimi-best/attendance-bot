const User = require("../models/user");

const addUser = data => {
  return new Promise((resolve, reject) => {
    if (Array.isArray(data) && data.length) {
      User.insertMany(data, (err, res) => {
        if (err) reject(`Error while creating array: ${err}`);

        resolve(res);
      });
    } else {
      User.create(data, (err, res) => {
        if (err) reject(`Error while creating one user: ${err}`);

        resolve(res);
      });
    }
  });
};

const findUser = params => {
  return new Promise((resolve, reject) => {
    User.find(params, (err, users) => {
      if (err) reject(`Error while finding user ${err}`);

      resolve(users);
    });
  });
};

const updateUser = (findField, setField) => {
  return new Promise((resolve, reject) => {
    User.updateOne(findField, { $set: setField }, (err, res) => {
      if (err) reject(`Error updating a user field ${err}`);

      resolve(res);
    });
  });
};

module.exports = {
  addUser,
  findUser,
  updateUser
};
