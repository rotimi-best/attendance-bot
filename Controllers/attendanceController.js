const { log } = console;
const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const { findUser } = require("../Db/User");
const { findGroup } = require("../Db/Groups");
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

      // console.log("Attendance just created", attendance);

      await addAttendance(attendance);

      setTimeout(async () => {
        // console.log(
        //   "Pushing attendance into spreadsheet",
        //   spreadsheet.id,
        //   sheet
        // );
        await pushAttendanceToSheet(spreadsheet.id, sheet, attendanceRes);
      }, 1000);

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
    const group = await findUser({
      name: groupName,
      owner: { telegramId, name: userName }
    });
    const [{ name, students, sheet, owner }] = group;
    const [
      {
        spreadsheet: { url }
      }
    ] = await findUser({ telegramId: ownerTelegramId });
    const attendances = await findAttendance({ ownerTelegramId });

    if (len(attendances)) {
      $.sendMessage(
        `Okay click [the link](${url}/edit#gid=${id}) to view your attendance`,
        {
          parse_mode: "Markdown",
          reply_markup: JSON.stringify({
            remove_keyboard: true
          })
        }
      );
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
    const telegramId = $.message.chat.id;
    const user = await findUser({ telegramId });

    if (len(user)) {
      // User
      const [{ spreadsheet }] = user;
      // Attendance
      const allAttendance = await findAttendance({
        ownerTelegramId: telegramId
      });

      if (len(allAttendance)) {
        // This user has taken at least an attendance
        const { groupName, result } = allAttendance[allAttendance.length - 1];
        // Group
        const group = await findGroup({ telegramId, name: groupName });
        const [{ sheet, owner }] = group;
        const absentStudents = result.filter(student => !student.present);

        $.sendMessage(`Alright ${owner.name}, lets begin. `, {
          reply_markup: JSON.stringify({
            remove_keyboard: true
          })
        });

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

          await addAttendance(attendance);

          setTimeout(async () => {
            // console.log(
            //   "Pushing attendance into spreadsheet",
            //   spreadsheet.id,
            //   sheet
            // );
            await pushAttendanceToSheet(spreadsheet.id, sheet, attendanceRes);
          }, 1000);

          $.sendMessage(`Great ${owner.name}, Done!`, {
            reply_markup: JSON.stringify({
              keyboard: [[{ text: "View Result" }]]
            })
          });
        } else {
          log("No students in this group");
        }
      } else {
        // No attendance yet, user needs to create a new one
      }
    }

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
