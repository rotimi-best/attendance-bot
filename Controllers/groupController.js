const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const UserController = require("./userController");

class GroupController extends TelegramBaseController {
  constructor() {
    super();
    this.userObj = { name: "", telegramId: 0 };
  }
  /**
   * Create a new group
   * @param {Scope} $
   */
  async addGroupHandler($) {
    //Form to create  a new group
  }

  /**
   * Get group
   * @param {Scope} $
   */
  async getGroupHandler($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  /**
   * Update with some params
   * @param {Scope} $
   */
  async updateGroupHandler($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  /**
   * Delete a group
   * @param {Scope} $
   */
  async deleteGroupHandler($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  async getUserName(telegramId) {
    if (this.userObj.telegramId === telegramId) {
      return this.userObj;
    }

    const userController = new UserController();
    const user = await userController.getUser({ telegramId });

    this.userObj = { name: user[0].name, telegramId: user[0].telegramId };
    return this.userObj;
  }

  get routes() {
    return {
      addGroupCommand: "addGroupHandler",
      getGroupCommand: "getGroupHandler",
      updateGroupCommand: "updateGroupHandler",
      deleteGroupCommand: "deleteGroupHandler"
    };
  }
}

module.exports = GroupController;
