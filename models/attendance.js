const mongoose = require('mongoose');
const Schema = mongoose.Schema();
const timestamp = require('mongoose-timestamp');

const AttendanceSchema = new Schema({
	groupName: String,
	ownerTelegramId: Number,
	result: [{
		studentName: String,
		present: Boolean
	}]
});

AttendanceSchema.plugin(timestamp);

const Attendance = mongoose.model('User', AttendanceSchema);

module.exports = Attendance;