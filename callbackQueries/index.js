const { TelegramBaseCallbackQueryController } = require("telegram-node-bot");
const AttendanceController = require("../Controllers/attendanceController");
const attendanceController = new AttendanceController();
const {
  CALLBACK_DATA: { VIEW_ATTENDANCE }
} = require("../helpers/constants");
const bot = require("../helpers/botConnection").get();

class CallbackQueryController extends TelegramBaseCallbackQueryController {
  async handle(query) {
    console.log(query.data);

    switch (query.data) {
      case VIEW_ATTENDANCE:
        attendanceController.getAttendanceHandler(bot.api);
        break;
      default:
        console.log("No option choosen");
    }

    bot.api.answerCallbackQuery(query.id, {
      text: `Use the commands to use this functionality.`
    });
  }
}

module.exports = CallbackQueryController;
