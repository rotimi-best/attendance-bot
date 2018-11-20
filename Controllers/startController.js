const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const UserController = require("./userController");
const userController = new UserController();

class StartController extends TelegramBaseController {
  /**
   * Scope of the message
   * @param {Scope} $
   */
  async startHandler($) {
    const telegramId = $.message.chat.id;
    let userName = $.message.chat.firstName
      ? $.message.chat.firstName
      : $.message.chat.lastName;

    const user = await userController.getUser({ telegramId: telegramId });
    if (user.length) {
      $.sendMessage(
        `Welcome ${
          user[0].name
        }.\n\nTo take a group attendance use the /attendance command`,
        {
          reply_markup: JSON.stringify({
            remove_keyboard: true
          })
        }
      );
      return;
    }

    $.sendMessage(`Hi there, can I call you ${userName}?`, {
      reply_markup: JSON.stringify({
        keyboard: [[{ text: "Yes 👍🏼" }], [{ text: "No 👎" }]],
        one_time_keyboard: true
      })
    });

    $.waitForRequest.then(async $ => {
      if ($.message.text === "Yes 👍🏼") {
        $.sendMessage(
          `Okay, Thanks ${userName}.\nTo begin taking attendance you need to create a group. Use the /newgroup command for that`,
          {
            reply_markup: JSON.stringify({
              remove_keyboard: true
            })
          }
        );
        await this.saveNewUser(userName, telegramId);
      } else if ($.message.text === "No 👎") {
        $.sendMessage(`What should I then call you?`);

        $.waitForRequest.then(async $ => {
          userName = $.message.text;
          $.sendMessage(
            `Okay, Thanks ${userName}.\nTo get started click /newgroup to create a new group`,
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

  /**
   *
   */
  async saveNewUser(userName, telegramId) {
    const user = await userController.getUser({ telegramId: telegramId });

    if (!user.length) {
      console.log("A new user was added");
      await userController.addUser({
        name: userName,
        telegramId: telegramId
      });
    } else {
      console.log("This user is already in the db");
    }
  }

  get routes() {
    return {
      startCommand: "startHandler"
    };
  }
}

module.exports = StartController;
