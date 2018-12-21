const { log } = console;
const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const { findUser } = require("../Db/User");
const { addAttendance, findAttendance } = require("../Db/Attendance");
const { pushAttendanceToSheet } = require("./spreadSheetController");
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
    const telegramId = $.message.chat.id;
    const [{ spreadsheet }] = await findUser({ telegramId });
    const [{ name, students, sheet, owner }] = group;

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

    if (len(students)) {
      const attendanceRes = [];

      for (const studentName of students) {
        $.runMenu({
          message: studentName,
          layout: 2,
          [thumbsUp]: () => {},
          [thumbsDown]: () => {}
        });

        const {
          message: { text }
        } = await $.waitForRequest;

        const present = text === thumbsUp ? true : false;

        attendanceRes.push({ studentName, present });
      }

      attendance.result = attendanceRes;

      console.log("Attendance just created", attendance);

      await addAttendance(attendance);

      setTimeout(async () => {
        console.log("Pushing attendance into spreadsheet");
        await pushAttendanceToSheet(spreadsheet.id, sheet, attendanceRes);
      }, 2000);

      $.sendMessage(`Great ${owner.name}, Done!`, {
        reply_markup: JSON.stringify({
          keyboard: [[{ text: "View Result" }]]
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
    const ownerTelegramId = $.message.chat.id;
    const [
      {
        spreadsheet: { url }
      }
    ] = await findUser({ telegramId: ownerTelegramId });
    const attendances = await findAttendance({ ownerTelegramId });

    if (len(attendances)) {
      $.sendMessage(`Okay click [the link](${url}) to view your attendance`, {
        parse_mode: "Markdown",
        reply_markup: JSON.stringify({
          remove_keyboard: true
        })
      });
    } else {
      $.sendMessage(
        `You have no attendance, use /newattendance to create one and it will appear in your [spreadsheet](${url})`,
        {
          parse_mode: "Markdown",
          reply_markup: JSON.stringify({
            remove_keyboard: true
          })
        }
      );
    }
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
