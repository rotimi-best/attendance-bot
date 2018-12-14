const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const { addUser, findUser } = require("../Db/User");

class GroupController extends TelegramBaseController {
  /**
   * User fields
   * @param {Object} $
   */
  async addUser(userData) {
    try {
      await addUser(userData);
    } catch (error) {
      console.error(
        "Error adding user in addUser func in GroupController",
        error
      );
    }
  }
  /**
   * Finding parameters
   * @param {Object} params
   */
  async getUser(params) {
    const { telegramId } = params;
    const user = await findUser({ telegramId });
    return user;
  }
}

module.exports = GroupController;
