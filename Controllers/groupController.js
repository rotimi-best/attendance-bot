const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const db = require("../Db");

class GroupController extends TelegramBaseController {
  /**
   * Scope of the message
   * @param {Scope} $
   */

  get routes() {
    return {
      startCommand: "startHandler"
    };
  }
}

module.exports = GroupController;
