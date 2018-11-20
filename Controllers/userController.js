const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const db = require("../Db");

class GroupController extends TelegramBaseController {
  /**
   * User fields
   * @param {Object} $
   */
  addUser(userDetails) {
    userDetails.collection = "users";
    db.insert(userDetails, (err, newDoc) => {
      if (err) return "Error occured" + err;
      console.log("New user created!");
      return newDoc;
    });
  }
  /**
   * Finding parameters
   * @param {Object} params
   */
  async getUser(params) {
    const { telegramId } = params;
    const user = await db.find({ telegramId: telegramId });
    return user;
  }
}

module.exports = GroupController;
