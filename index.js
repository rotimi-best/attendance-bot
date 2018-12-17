const Telegram = require("telegram-node-bot");
const mongoose = require("mongoose");
const TextCommand = Telegram.TextCommand;
const RegexpCommand = Telegram.RegexpCommand;
const bot = require("./helpers/botConnection").get();

const StartController = require("./Controllers/startController");
const GroupController = require("./Controllers/groupController");
const AttendanceController = require("./Controllers/attendanceController");
const HelpController = require("./Controllers/helpController");
const OtherwiseController = require("./Controllers/otherwiseController");
const CallbackQueryController = require("./callbackQueries");
const { MONGO_URI } = require("./helpers/config");

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

bot.router.callbackQuery(new CallbackQueryController());

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
  // .when(
  //   new TextCommand("/newattendance", "takeAttendanceCommand"),
  //   new AttendanceController()
  // )
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
