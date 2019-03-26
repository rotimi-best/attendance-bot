const { log } = console;
const {
  date,
  getAuthenticatedSheet,
  getArrayForSheetFromAttendance
} = require("../modules");
const updateSheet = require("../modules/updateSheet");

const createNewSpreadSheet = title => {
  return new Promise(async (res, rej) => {
    const resource = {
      properties: {
        title
      }
    };

    const sheets = await getAuthenticatedSheet();

    sheets.spreadsheets.create(
      {
        resource,
        fields: "spreadsheetId"
      },
      (err, spreadsheet) => {
        if (err) {
          rej(err);
        } else {
          res(spreadsheet.data.spreadsheetId);
        }
      }
    );
  });
};

const createNewSheet = (spreadsheetId, title) => {
  return new Promise(async (res, rej) => {
    const sheets = await getAuthenticatedSheet();

    sheets.spreadsheets.batchUpdate(
      {
        spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title
                }
              }
            }
          ]
        }
      },
      async (err, response) => {
        if (err) rej("createNewSheet Error: " + err);

        const sheet_id = response.data.replies[0].addSheet.properties.sheetId;
        // console.log("\nCreated New sheet", sheet_id);
        res(sheet_id);
      }
    );
  });
};

const addStudentsToSheet = async (spreadsheetId, SHEET, students) => {
  students.unshift("Students");

  // console.log(students);

  await updateSheet(spreadsheetId, SHEET, students);
};

const updateSheetWithLessonsMissed = async allAttendance => {
  const lessonsStats = {};

  for (let attendance of allAttendance) {
    const { result } = attendance;

    for (let res of result) {
      const { studentName, present } = res;
      const absentOrPresentNo = present ? 0 : 1;

      if (lessonsStats[studentName]) {
        lessonsStats[studentName] =
          lessonsStats[studentName] + absentOrPresentNo;
      } else {
        lessonsStats[studentName] = absentOrPresentNo;
      }
    }
  }

  return lessonsStats;
};

const pushAttendanceToSheet = async (
  spreadsheetId,
  SHEET,
  attendance,
  nextColumn
) => {
  const attRes = getArrayForSheetFromAttendance(attendance);
  // console.log(attRes);
  attRes.unshift(date());
  // console.log(attRes);

  await updateSheet(spreadsheetId, SHEET, attRes, nextColumn);
};

module.exports = {
  updateSheet,
  createNewSheet,
  addStudentsToSheet,
  createNewSpreadSheet,
  pushAttendanceToSheet,
  updateSheetWithLessonsMissed
};
