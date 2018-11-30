const User = require('../models/group');

const addUser = data => {
  return new Promise(async (resolve, reject) => {
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
  return new Promise(async (resolve, reject) => {
    
  });
};

const updateUser = (findField, setField) => {
  return new Promise(async (resolve, reject) => {
    
  });
};

const deleteUser = findField => {
  return new Promise(async (resolve, reject) => {

  });
};

module.exports = {
  addUser,
  findUser,
  updateUser,
  deleteUser
};
