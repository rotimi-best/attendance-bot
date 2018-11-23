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
    const ifgroup = await getGroupHandler($, "Group 1");
    console.log(ifgroup);
    //Form to create  a new group
    // const form = this.makeNewGroupFrom($);
    // $.runForm(form, result => {
    //   console.log(result);
    // });
  }

  /**
   * Get group
   * @param {Scope} $ Scope of message
   * @param {String} name Name of the group
   */
  async getGroupHandler($, name) {
    const telegramId = $.message.chat.id;
    let userNameAlreadyExist = null;

    //Check if a particular group exists
    if (name) {
      const groups = await db.find({
        collection: GROUPS,
        name,
        owner: { telegramId }
      });
      if (groups.length > 0) return (userNameAlreadyExist = true);
      else return (userNameAlreadyExist = false);
    }

    //Find all groups created by this particular user
    const groups = await db.find({ collection: GROUPS, owner: { telegramId } });
    const userName = await this.getUserName(telegramId);

    if (groups.length > 0) {
      const buttons = [];

      groups.forEach(({ name }) => {
        const button = [{ text: name }];
        buttons.push(button);
      });

      $.sendMessage(`Here you go ${userName}:`, {
        reply_markup: JSON.stringify({
          keyboard: buttons,
          one_time_keyboard: true
        })
      });
    } else {
      $.sendMessage(
        `Sorry ${userName}, you havn't created any group yet, use the /newgroup command to create one.`
      );
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

  makeNewGroupFrom($) {
    return {
      name: {
        q: "Alright, new group. What would be the name of your group?",
        error:
          "Sorry try again, name has already been used and must begin with a word.",
        validator: async (message, callback) => {
          const userReply = message.text;
          const testIfBeginsWithWord = /^[A-z a-z]/g.test(userReply);

          if (!testIfBeginsWithWord) callback(false);

          const ifGroupExist = await this.getGroupHandler($, userReply);

          if (!ifGroupExist) {
            callback(true, message.text);
            return;
          }
          callback(false);
        }
      },
      age: {
        q:
          "Great. Now send me the names of your students seperated with a comma, like Bill Gates, Steve Jobs, Barak Obama, Joshua Selman",
        error: "Sorry, make sure it is seperated with a comma",
        validator: (message, callback) => {
          const userReply = message.text;
          if (message.text && NaN(message.text)) {
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
