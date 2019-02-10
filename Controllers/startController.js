const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const UserController = require("./userController");
const userController = new UserController();
const { createNewSpreadSheet } = require("./spreadSheetController");
const {
  emojis: { wave, thumbsUp, thumbsDown, ok },
  makeSpreadSheetUrl
} = require("../modules");

class StartController extends TelegramBaseController {
  constructor($) {
    super($);
    this.nameOfUser = "";
    // console.log($)
    // this.telegramIdOfUser = '';
  }

  /**
   * Scope of the message
   * @param {Scope} $
   */
  async startHandler($) {
    const telegramId = $.message.chat.id;
    const YES = `Yes ${thumbsUp}`;
    const NO = `No ${thumbsDown}`;
    let userName = $.message.chat.firstName
      ? $.message.chat.firstName
      : $.message.chat.lastName;

    const user = await userController.getUser({ telegramId });
    if (user.length) {
      this.nameOfUser = user[0].name;
      $.sendMessage(
        `Welcome back ${
          this.nameOfUser
        } ${wave}.\n\nTo take a group attendance use the /newattendance command`,
        {
          reply_markup: JSON.stringify({
            remove_keyboard: true
          })
        }
      );
      return;
    }

    $.sendMessage(`Hi there! ${wave} Can I call you ${userName}?`, {
      reply_markup: JSON.stringify({
        keyboard: [[{ text: YES }], [{ text: NO }]],
        one_time_keyboard: true
      })
    });

    $.waitForRequest.then(async $ => {
      if ($.message.text === YES) {
        await this.replyNewUser($, userName, telegramId);
      } else if ($.message.text === NO) {
        $.sendMessage(`What should I then call you?`);

        $.waitForRequest.then(async $ => {
          userName = $.message.text;
          await this.replyNewUser($, userName, telegramId);
        });
      }
    });
  }

  async replyNewUser($, userName, telegramId) {
    try {
      const spreadSheetUrl = await this.saveNewUser(userName, telegramId);

      $.sendMessage(
        `Okay, Thanks ${userName} ${ok}, I created a new spreadsheet for you where I will store all your attendances, [open it](${spreadSheetUrl}).\n\nTo begin taking attendance you need to create a group. Use the /newgroup command for that.`,
        {
          parse_mode: "Markdown",
          reply_markup: JSON.stringify({
            remove_keyboard: true
          })
        }
      );
    } catch (error) {
      $.sendMessage(
        `Sorry ${userName} something went I couldn't create a spreadsheet for you. My creator will fix it`,
        {
          parse_mode: "Markdown",
          reply_markup: JSON.stringify({
            remove_keyboard: true
          })
        }
      );

      // console.log(error);
    }
  }

  testHandler() {
    // console.log(this.nameOfUser);
  }

  /**
   * @param {String} name Name of the user
   * @param {Number} telegramId Telegram ID of user
   */
  saveNewUser(name, telegramId) {
    return new Promise(async (res, rej) => {
      try {
        // console.log("A new user was added");
        const spreadSheetId = await createNewSpreadSheet(name);
        const spreadSheetUrl = makeSpreadSheetUrl(spreadSheetId);

        await userController.addUser({
          name,
          telegramId,
          spreadsheet: {
            id: spreadSheetId,
            url: spreadSheetUrl
          }
        });
        this.nameOfUser = name;

        res(spreadSheetUrl);
      } catch (error) {
        console.error(error);
        rej(error);
      }
    });
  }

  get routes() {
    return {
      startCommand: "startHandler",
      testCommand: "testHandler"
    };
  }
}

module.exports = StartController;
