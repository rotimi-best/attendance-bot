const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const {
  emojis: { thumbsUp, thumbsDown },
  len
} = require("../modules");

class AttendanceController extends TelegramBaseController {
  /**
   * Update with some params
   * @param {Scope} $
   */
  async takeAttendanceHandler($, group) {
    const [{ name, students, spreadsheetLink, owner }] = group;

    $.sendMessage(
      `Alright ${
        owner.name
      }, lets begin. I will send you the names of all the students in your group.\n\nClick ${thumbsUp} if present and ${thumbsDown} if absent.`,
      {
        reply_markup: JSON.stringify({
          remove_keyboard: true
        })
      }
    );
  }

  /**
   * Delete a group
   * @param {Scope} $
   */
  async getAttendanceHandler($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  /**
   * Delete a group
   * @param {Scope} $
   */
  async updateAttendanceHandler($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  get routes() {
    return {
      takeAttendanceCommand: "takeAttendanceHandler",
      getAttendanceCommand: "getAttendanceHandler",
      updateAttendanceCommand: "updateAttendanceHandler"
    };
  }
}

module.exports = AttendanceController;
