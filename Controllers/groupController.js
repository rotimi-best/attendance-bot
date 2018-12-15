const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const UserController = require("./userController");
const { addGroup, findGroup } = require("../Db/Groups");
const {
  DB_COLLECTIONS: { USERS, GROUPS, ATTENDANCES }
} = require("../helpers/constants");
const {
  emojis: { thumbsUp, thumbsDown }
} = require("../modules");

class GroupController extends TelegramBaseController {
  constructor() {
    super();
    this.userObj = { userName: "", telegramId: 0 };
  }

  /**
   * Create a new group
   * @param {Scope} $
   */
  async addGroupHandler($) {
    //Get name
    const telegramId = $.message.chat.id;
    const { userName } = await this.getUserName(telegramId);
    const form = this.makeNewGroupFrom($);
    $.runForm(form, async ({ groupName, students }) => {
      const groupData = {
        name: groupName,
        students,
        owner: {
          telegramId,
          name: userName
        },
        spreadsheetLink: "",
        sheetName: ""
      };

      $.sendMessage(
        `Great ${userName}, Your group has successfully been created.`
      );
      await addGroup(groupData);
      console.log(groupData);
    });
  }

  /**
   * Get group
   * @param {Scope} $ Scope of message
   * @param {String} name Name of the group
   */
  async getGroupHandler($, groupObj) {
    const telegramId = $.message.chat.id;
    const { userName } = await this.getUserName(telegramId);
    let groupAlreadyExist = null;

    if (groupObj) {
      const { groupName } = groupObj;
      const groups = await findGroup({
        name: groupName,
        owner: { telegramId, name: userName }
      });

      console.log(groups);
      if (groups.length > 0) return (groupAlreadyExist = true);
      else return (groupAlreadyExist = false);
    }

    //Find all groups created by this particular user
    const groups = await findGroup({
      owner: { telegramId, name: userName }
    });

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

    this.userObj = { userName: user[0].name, telegramId: user[0].telegramId };
    return this.userObj;
  }

  makeNewGroupFrom($) {
    return {
      groupName: {
        q: "Alright, What would be the name of your group?",
        error:
          "Sorry try again, name has already been used or didn't begin with a word.",
        validator: async (message, callback) => {
          const groupName = message.text;
          const testIfText = /^[A-z a-z]/g.test(groupName);

          const ifGroupExist = await this.getGroupHandler($, { groupName });

          if (testIfText === true && !ifGroupExist) {
            callback(true, groupName);
            return;
          }
          callback(false);
        }
      },
      students: {
        q:
          "Great. Now send me the names of your students seperated with a comma, like Bill Gates, Steve Jobs",
        error: "Sorry, make sure it is seperated with a comma, be words only.",
        validator: (message, callback) => {
          const userReply = message.text;
          const testIfText = /^[A-z a-z]/g.test(userReply);

          const students = userReply ? userReply.split(",") : false;

          if (testIfText && students && students.length) {
            callback(true, students);
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
