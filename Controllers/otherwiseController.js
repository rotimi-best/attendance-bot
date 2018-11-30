const { log } = console;
const { TelegramBaseController } = require("telegram-node-bot");


class OtherwiseController extends TelegramBaseController {
    handle($) {
        const msg = $.message.text;
        const id = $.message.chat.id;
        log(id)
        log(msg)
    }
}

module.exports = OtherwiseController;