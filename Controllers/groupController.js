const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const db = require("../Db");

class GroupController extends TelegramBaseController {


  /**
   * Create a new group
   * @param {Scope} $
   */
    async addGroupHandler ($) {
      //Form to create  a new group
    }

  /**
   * Get group
   * @param {Scope} $
   */
  async getGroupHandler ($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  /**
   * Update with some params
   * @param {Scope} $
   */
  async updateGroupHandler ($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  /**
   * Delete a group
   * @param {Scope} $
   */
  async deleteGroupHandler ($) {
    $.sendMessage(`${$.message.text} is still under production`);
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
