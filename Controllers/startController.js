const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const UserController = require("./userController");
const userController = new UserController();
const {
  emojis: { wave, thumbsUp, thumbsDown, ok }
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
        keyboard: [
          [{ text: `Yes ${thumbsUp}` }],
          [{ text: `No ${thumbsDown}` }]
        ],
        one_time_keyboard: true
      })
    });

    $.waitForRequest.then(async $ => {
      if ($.message.text === `Yes ${thumbsUp}`) {
        $.sendMessage(
          `Okay, Thanks ${userName} ${ok}.\n\nTo begin taking attendance you need to create a group. Use the /newgroup command for that.`,
          {
            reply_markup: JSON.stringify({
              remove_keyboard: true
            })
          }
        );
        await this.saveNewUser(userName, telegramId);
      } else if ($.message.text === `No ${thumbsDown}`) {
        $.sendMessage(`What should I then call you?`);

        $.waitForRequest.then(async $ => {
          userName = $.message.text;
          $.sendMessage(
            `Okay, Thanks ${userName} ${ok}.\n\nTo begin taking attendance you need to create a group. Use the /newgroup command for that.`,
            {
              reply_markup: JSON.stringify({
                remove_keyboard: true
              })
            }
          );

          await this.saveNewUser(userName, telegramId);
        });
      }
    });
  }

  testHandler() {
    console.log(this.nameOfUser);
  }

  /**
   * @param {String} userName Name of the user
   * @param {Number} telegramId Telegram ID of user
   */
  async saveNewUser(userName, telegramId) {
    console.log("A new user was added");

    await userController.addUser({
      name: userName,
      telegramId,
      spreadsheet: {
        id: "",
        url: ""
      }
    });
    this.nameOfUser = userName;
  }

  get routes() {
    return {
      startCommand: "startHandler",
      testCommand: "testHandler"
    };
  }
}

module.exports = StartController;
