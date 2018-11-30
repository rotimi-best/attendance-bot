const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const attendanceSchema = new Schema({

});


const Attendance = mongoose.model('User', attendanceSchema);

module.exports = Attendance;