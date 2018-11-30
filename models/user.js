const mongoose = require('mongoose');
const Schema = mongoose.Schema();
const timestamp = require('mongoose-timestamp');

const UserSchema = new Schema({
  name: String,
  telegramId: Number
});

UserSchema.plugin(timestamp);

const User = mongoose.model('User', UserSchema);

module.exports = User;