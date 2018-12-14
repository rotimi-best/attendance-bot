const Attendance = require("../models/attendance");

const addAttendance = data => {
  return new Promise((resolve, reject) => {
    if (Array.isArray(data) && data.length) {
      Attendance.insertMany(data, (err, res) => {
        if (err) reject(`Error while creating array: ${err}`);

        resolve(res);
      });
    } else {
      Attendance.create(data, (err, res) => {
        if (err) reject(`Error while creating one Attendance: ${err}`);

        resolve(res);
      });
    }
  });
};

const findAttendance = params => {
  return new Promise((resolve, reject) => {
    Attendance.find(params, (err, Attendances) => {
      if (err) reject(`Error while finding Attendance ${err}`);

      resolve(Attendances);
    });
  });
};

const updateAttendance = (findField, setField) => {
  return new Promise((resolve, reject) => {
    Attendance.update(findField, { $set: setField }, (err, res) => {
      if (err) reject(`Error updating a Attendance field ${err}`);

      resolve(res);
    });
  });
};

module.exports = {
  addAttendance,
  findAttendance,
  updateAttendance,
  deleteAttendance
};
