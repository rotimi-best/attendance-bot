const { TelegramBaseCallbackQueryController } = require("telegram-node-bot");
const bot = require("../helpers/botConnection").get();


class CallbackQueryController extends TelegramBaseCallbackQueryController {
  async handle(query) {
    console.log(query.data);

    switch (query.data) {
      case "111":
        console.log("New todo");
        break;
      default:
        console.log("No option choosen");
    }

    bot.api.answerCallbackQuery(query.id, {
      text: `Use the commands to use this functionality.`
    });
  }
}

module.exports = CallbackQueryController;
