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
  .when(new TextCommand("/newgroup", "startCommand"), new StartController())
  .when(new TextCommand("/mygroups", "startCommand"), new StartController())
  .when(new TextCommand("/attendance", "startCommand"), new StartController())
  .when(new TextCommand("/help", "helpCommand"), new HelpController())
  .when(new TextCommand("/addstudent", "startCommand"), new StartController())
  .when(new TextCommand("/deletgroup", "startCommand"), new StartController())
  .when(
    new TextCommand("/spreadsheetlink", "startCommand"),
    new StartController()
  )
  .when(new TextCommand("/setname", "startCommand"), new StartController());
