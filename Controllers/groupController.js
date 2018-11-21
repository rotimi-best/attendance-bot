const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const UserController = require("./userController");
const userController = new UserController();
const db = require("../Db");
const {
  DB_COLLECTIONS: { USERS, GROUPS, ATTENDANCES }
} = require("../helpers/constants");

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
    //Get name
    const telegramId = $.message.chat.id;
    const userName = await this.getUserName(telegramId);

    //Form to create  a new group
    const form = this.makeNewGroupFrom();
    $.runForm(form, result => {
      console.log(result);
    });
  }

  /**
   * Get group
   * @param {Scope} $
   */
  async getGroupHandler($, name) {
    //Check if a particular group exists
    if (name) {
      const group = await db.find({ collection: GROUPS, name });
      let userNameAlreadyExist = null;
      if (group.length > 0) return (userNameAlreadyExist = true);
      else return (userNameAlreadyExist = false);
    }
    //Find all groups created by this particular user
    const telegramId = $.message.chat.id;
    const group = await db.find({ collection: GROUPS, telegramId });
    const userName = await this.getUserName(telegramId);

    if (group.length > 0) {
      // continue here
      $.sendMessage(`Here you go ${userName}:`)
    }
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

  makeNewGroupFrom() {
    return {
      name: {
        q: "Alright, new group. What would be the name of your group?",
        error: "Sorry, that's not a valid name or it has been taken",
        validator: async (message, callback) => {
          const user = await userController.getUser({});
          if (message.text) {
            callback(true, message.text);
            return;
          }

          callback(false);
        }
      },
      age: {
        q: "Send me your age",
        error: "sorry, wrong input",
        validator: (message, callback) => {
          if (message.text && IsNumeric(message.text)) {
            callback(true, toInt(message.text));
            return;
          }

          callback(false);
        }
      }
    };
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
