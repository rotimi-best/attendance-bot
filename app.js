const Telegram = require("telegram-node-bot");
const TextCommand = Telegram.TextCommand;
require("dotenv").config();

const StartController = require("./Controllers/startController");
const HelpController = require("./Controllers/helpController");

const bot = new Telegram.Telegram(process.env.API_KEY, {
  workers: 1,
  webAdmin: {
    port: 8081,
    host: "127.0.0.1"
  }
});

bot.router
  .when(new TextCommand("/start", "startCommand"), new StartController())
  .when(new TextCommand("/newgroup", "newGroupCommand"), new StartController())
  .when(new TextCommand("/mygroups", "myGroupsCommand"), new StartController())
  .when(new TextCommand("/attendance", "attendanceCommand"), new StartController())
  .when(new TextCommand("/help", "helpCommand"), new HelpController())
  .when(new TextCommand("/addstudent", "addStudentCommand"), new StartController())
  .when(new TextCommand("/deletgroup", "deletGroupCommand"), new StartController())
  .when(
    new TextCommand("/spreadsheetlink", "spreadsheetLinkCommand"),
    new StartController()
  )
  .when(new TextCommand("/setname", "setNameCommand"), new StartController());
