const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const db = require("../Db");

class HelpController extends TelegramBaseController {
  /**
   * Scope of the message
   * @param {Scope} $
   */
  helpHandler($) {
    $.sendMessage(
      `You can control me by sending these commands:\n\n/newgroup - create a new group (like a class with students)\n/mygroups - edit your groups\n/attendance - take a class attendance\n/help - get help from my creator\n\n*Edit Group*\n/setname - change a group's name\n/addstudent - add student(s) to a group\n/spreadsheetlink - view group in spreadsheet\n/deletegroup - delete a group\n\nStill confusing? Talk to my [creator](https://t.me/living_logos)`,
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
