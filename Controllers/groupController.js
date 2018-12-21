const Telegram = require("telegram-node-bot");
const TelegramBaseController = Telegram.TelegramBaseController;
const UserController = require("./userController");
const AttendanceController = require("./attendanceController");
const attendanceController = new AttendanceController();
const {
  createNewSheet,
  addStudentsToSheet
} = require("./spreadSheetController");
const { addGroup, findGroup } = require("../Db/Groups");
const {
  DB_COLLECTIONS: { USERS, GROUPS, ATTENDANCES }
} = require("../helpers/constants");
const {
  emojis: { thumbsUp, thumbsDown, write },
  len
} = require("../modules");
const { log } = console;

class GroupController extends TelegramBaseController {
  constructor() {
    super();
    this.userObj = { userName: "", telegramId: 0, spreadsheet: {} };
  }

  /**
   * Create a new group
   * @param {Scope} $
   */
  async addGroupHandler($) {
    //Get name
    const telegramId = $.message.chat.id;
    const { userName, spreadsheet } = await this.getUser(telegramId);
    const form = this.makeNewGroupFrom($);

    $.runForm(form, async ({ groupName, students }) => {
      const trimmedStudents = Array.isArray(students)
        ? students.map(stud => stud.trim())
        : students;

      const sheetId = await createNewSheet(spreadsheet.id, groupName);

      const groupData = {
        name: groupName,
        students: trimmedStudents,
        owner: {
          telegramId,
          name: userName
        },
        sheet: {
          id: sheetId,
          name: groupName
        }
      };

      console.log(groupData);
      await addGroup(groupData);

      setTimeout(async () => {
        const SHEET = { id: sheetId, name: groupName };
        await addStudentsToSheet(spreadsheet.id, SHEET, trimmedStudents);
      }, 2000);

      $.sendMessage(
        `Great job ${userName}, group created and I also created a new sheet in your spreadsheet called ${groupName}.\n\nUse /viewattendance to get the link`
      );
    });
  }

  /**
   * Get group
   *
   * @param {Scope} $ Scope of message
   * @param {String} name Name of the group
   */
  async getGroupHandler($, groupObj) {
    const telegramId = $.message.chat.id;
    const { userName } = await this.getUser(telegramId);
    let groupAlreadyExist = null;

    if (groupObj) {
      const { groupName } = groupObj;
      const group = await findGroup({
        name: groupName,
        owner: { telegramId, name: userName }
      });

      if (len(group)) return group;
      else return (groupAlreadyExist = false);
    }

    //Find all groups created by this particular user
    const groups = await findGroup({
      owner: { telegramId, name: userName }
    });

    if (len(groups)) {
      const groupsMenu = {
        message: `Here you go ${userName}:`,
        resizeKeyboard: true,
        layout: 2
      };

      groups.forEach(({ name }) => {
        groupsMenu[name] = async () => {
          await this.groupDetailsMenu($, name);
        };
      });

      $.runMenu(groupsMenu);
    } else {
      $.sendMessage(
        `Sorry ${userName}, you havn't created any group yet, use the /newgroup command to create one.`
      );
    }
  }

  /**
   * Update with some params
   *
   * @param {Scope} $
   */
  async updateGroupHandler($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  /**
   * Delete a group
   *
   * @param {Scope} $
   */
  async deleteGroupHandler($) {
    $.sendMessage(`${$.message.text} is still under production`);
  }

  async getUser(telegramId) {
    if (this.userObj.telegramId === telegramId) {
      return this.userObj;
    }

    const userController = new UserController();
    const user = await userController.getUser({ telegramId });

    const [{ name, spreadsheet }] = user;

    this.userObj = { userName: name, telegramId, spreadsheet };
    return this.userObj;
  }

  makeNewGroupFrom($) {
    return {
      groupName: {
        q:
          "Alright, What would be the name of your group?\n\nPlease it must begin with Group like: Group 1 or Group_1",
        error: "Sorry try again, group exists or doesn't begin with Group",
        validator: async (message, callback) => {
          const groupName = message.text;
          const testIfText = /^Group/g.test(groupName);
          log("Test", testIfText);

          const group = await this.getGroupHandler($, { groupName });
          log("group", group);

          if (testIfText && !group) {
            callback(true, groupName);
            return;
          }
          callback(false);
        }
      },
      students: {
        q:
          "Great. Now send me the names of your students seperated with a comma, like Bill Gates, Steve Jobs",
        error: "Sorry, make sure it is seperated with a comma, be words only.",
        validator: (message, callback) => {
          const userReply = message.text;
          const testIfText = /^[A-z a-z]/g.test(userReply);

          const students = userReply ? userReply.split(",") : false;

          if (testIfText && students && len(students)) {
            callback(true, students);
            return;
          }

          callback(false);
        }
      }
    };
  }

  async groupDetailsMenu($, groupName) {
    const group = await this.getGroupHandler($, { groupName });
    const groupDetail = this.groupDetails(group);

    $.runMenu({
      message: groupDetail,
      options: {
        parse_mode: "HTML"
      },
      layout: 1,
      ["Take Attendance " + write]: () => {
        attendanceController.takeAttendanceHandler($, group);
      }
    });
  }

  groupDetails(group) {
    const [{ name, students }] = group;
    let studentList = "";

    if (!len(students)) studentList = "None";

    for (const student of students) {
      studentList += `\n - ${student}`;
    }

    const groupDetail = `<b>Name</b>: ${name}\n<b>No of Students</b>: ${len(
      students
    )}\n<b>Students</b>: ${studentList}`;

    return groupDetail;
  }

  get routes() {
    return {
      addGroupCommand: "addGroupHandler",
      getGroupCommand: "getGroupHandler",
      updateGroupCommand: "updateGroupHandler",
      deleteGroupCommand: "deleteGroupHandler"
    };
  }
}

module.exports = GroupController;
