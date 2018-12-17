const Telegram = require("telegram-node-bot");
require("dotenv").config();

let bot = null;

module.exports = {
  get() {
    if (!bot) {
      bot = new Telegram.Telegram(process.env.API_KEY, {
        workers: 1,
        webAdmin: {
          port: 8081,
          host: "127.0.0.1"
        }
      });
      return bot;
    } else {
      return bot;
    }
  }
};
