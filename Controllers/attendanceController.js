const { log } = console;
const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const { addAttendance } = require("../Db/Attendance");
const {
  emojis: { thumbsUp, thumbsDown },
  len
} = require("../modules");
const {
  CALLBACK_DATA: { VIEW_ATTENDANCE }
} = require("../helpers/constants");

class AttendanceController extends TelegramBaseController {
  /**
   * Take an attendance
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
    const attendance = {
      groupName: name,
      ownerTelegramId: owner.telegramId
    };
    const attendanceRes = [];

    if (len(students)) {
      for (const student of students) {
        $.runMenu({
          message: student,
          layout: 2,
          [thumbsUp]: () => {},
          [thumbsDown]: () => {}
        });

        const {
          message: { text }
        } = await $.waitForRequest;

        const studentName = student;
        const present = text === thumbsUp ? true : false;

        attendanceRes.push({ studentName, present });
      }

      attendance.result = attendanceRes;

      await addAttendance(attendance);
      $.sendMessage(`Great ${owner.name}, Done!`, {
        reply_markup: JSON.stringify({
          keyboard: [[{ text: "View Result", callback_data: VIEW_ATTENDANCE }]]
        })
      });
    } else {
      log("No students in this group");
    }
  }

  /**
   * Get attendance
   * @param {Scope} $
   */
  async getAttendanceHandler($) {
    $.sendMessage(`${$.message.text} Okay`, {
      reply_markup: JSON.stringify({
        remove_keyboard: true
      })
    });
  }

  /**
   * Update an attendance
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
