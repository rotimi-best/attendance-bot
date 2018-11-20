const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const db = require("../Db");

class AttendanceController extends TelegramBaseController {

  /**
   * Update with some params
   * @param {Scope} $
   */
  async addAttendanceHandler ($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  /**
   * Delete a group
   * @param {Scope} $
   */
  async getAttendanceHandler ($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  /**
   * Delete a group
   * @param {Scope} $
   */
  async updateAttendanceHandler ($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  get routes() {
    return {
        addAttendanceCommand: "addAttendanceHandler",
        getAttendanceCommand: "getAttendanceHandler",
        updateAttendanceCommand: "updateAttendanceHandler"
    };
  }
}

module.exports = AttendanceController;
