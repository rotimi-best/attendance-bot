const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: String,
    students: [String],
    owner: {
        telegramId: Number,
        name: String
    },
    spreadsheetLink: String,
    sheetName: String
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;