const Telegram = require("telegram-node-bot");
const mongoose = require("mongoose");
const TextCommand = Telegram.TextCommand;
const RegexpCommand = Telegram.RegexpCommand;

const StartController = require("./Controllers/startController");
const GroupController = require("./Controllers/groupController");
const AttendanceController = require("./Controllers/attendanceController");
const HelpController = require("./Controllers/helpController");
const OtherwiseController = require("./Controllers/otherwiseController");
const { MONGO_URI } = require("./helpers/config");

const bot = new Telegram.Telegram(process.env.API_KEY, {
  workers: 1,
  webAdmin: {
    port: 8081,
    host: "127.0.0.1"
  }
});

mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true }
);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on("error", err => console.log(err));

db.once("open", () => {
  console.log("DB has been opened");
});

bot.router
  .when(new TextCommand("/start", "startCommand"), new StartController())
  .when(new TextCommand("/newgroup", "addGroupCommand"), new GroupController())
  .when(new TextCommand("/mygroups", "getGroupCommand"), new GroupController())
  .when(new TextCommand("/rename", "updateGroupCommand"), new GroupController())
  .when(
    new TextCommand("/addstudent", "updateGroupCommand"),
    new GroupController()
  )
  .when(
    new TextCommand("/deletegroup", "deleteGroupCommand"),
    new GroupController()
  )
  .when(
    new TextCommand("/newattendance", "addAttendanceCommand"),
    new AttendanceController()
  )
  .when(
    new TextCommand("/viewattendance", "getAttendanceCommand"),
    new AttendanceController()
  )
  .when(
    new TextCommand("/editattendance", "updateAttendanceCommand"),
    new AttendanceController()
  )
  .when(new TextCommand("/help", "helpCommand"), new HelpController())
  .when(new TextCommand("/test", "testCommand"), new StartController())
  // .when(new RegexpCommand(/test/g, "testHandler"), new GroupController())
  .otherwise(new OtherwiseController());
