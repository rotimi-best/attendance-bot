const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;

class HelpController extends TelegramBaseController {
  /**
   * Listen to /help command
   * @param {Scope} $
   */
  helpHandler($) {
    $.sendMessage(
      `You can control me by sending these commands:\n\nGeneral\n/newgroup - create a new group (like a class with students)\n/mygroups - take attendance of your group\n/help - get help\n\nEdit Group (Future Functionalities)\nrename - change a group's name\naddstudent - add student(s) to a group\ndeletegroup - delete a group\n\nAttendance\n/editattendance - take last attendance again\n/viewallattendance - view register\n\nStill confused? Talk to my [creator](https://t.me/living_logos)`,
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
