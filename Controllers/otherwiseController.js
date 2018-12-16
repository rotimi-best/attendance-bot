const { log } = console;
const { TelegramBaseController } = require("telegram-node-bot");
const HelpController = require("./helpController");
const helperController = new HelpController();

class OtherwiseController extends TelegramBaseController {
  handle($) {
    const msg = $.message.text;
    const id = $.message.chat.id;
    log(id);
    log(msg);
    $.sendMessage("I am a robot and didn't quite understand what you said", {
      reply_markup: JSON.stringify({
        remove_keyboard: true
      })
    });

    // helperController($);
  }
}

module.exports = OtherwiseController;
