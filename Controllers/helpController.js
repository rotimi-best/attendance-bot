const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;

class HelpController extends TelegramBaseController {
  /**
   * Scope of the message
   * @param {Scope} $
   */
  helpHandler($) {
    $.sendMessage(
      `You can control me by sending these commands:\n\n/newgroup - create a new group (like a class with students)\n/mygroups - take attendance of your group\n/help - get help\n\nEdit Group\n/rename - change a group's name\n/addstudent - add student(s) to a group\n/deletegroup - delete a group\n\nAttendance\n/editattendance - repeat attendance\n/viewallattendance - view register\n\nStill confused? Talk to my [creator](https://t.me/living_logos)`,
      { parse_mode: "Markdown", disable_web_page_preview: true }
    );
  }

  get routes() {
    return {
      helpCommand: "helpHandler"
    };
  }
}

module.exports = HelpController;
