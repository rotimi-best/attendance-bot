const { log } = console;
const { date, emojis, getAuthenticatedSheet } = require("./index");
const { ALPHABETS } = require("../helpers/constants");

const statisticsToSheet = async (spreadsheetId, range, values) => {
  const sheets = await getAuthenticatedSheet();

  sheets.spreadsheets.values.batchUpdate(
    {
      spreadsheetId,
      resource: {
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: range,
            majorDimension: "COLUMNS",
            values: [values]
          }
        ]
      }
    },
    (err, result) => {
      if (err) log("companyspreadsheet The API returned an error: " + err);
      log("Pushed into sheet", result);
    }
  );
};

const drawTableBorder = async (
  spreadsheetId,
  sheetId,
  startColumnIndex,
  endColumnIndex
) => {
  const sheets = await getAuthenticatedSheet();
  const number = 0;
  const requests = [];

  requests.push({
    updateBorders: {
      range: {
        sheetId: sheetId,
        startRowIndex: 0,
        endRowIndex: 4,
        startColumnIndex: startColumnIndex,
        endColumnIndex: endColumnIndex
      },
      top: {
        style: "SOLID",
        width: 1,
        color: {
          red: number,
          green: number,
          blue: number
        }
      },
      bottom: {
        style: "SOLID",
        width: 1,
        color: {
          red: number,
          green: number,
          blue: number
        }
      },
      left: {
        style: "SOLID",
        width: 1,
        color: {
          red: number,
          green: number,
          blue: number
        }
      },
      right: {
        style: "SOLID",
        width: 1,
        color: {
          red: number,
          green: number,
          blue: number
        }
      },
      innerHorizontal: {
        style: "SOLID",
        width: 1,
        color: {
          red: number,
          green: number,
          blue: number
        }
      },
      innerVertical: {
        style: "SOLID",
        width: 1,
        color: {
          red: number,
          green: number,
          blue: number
        }
      }
    }
  });

  sheets.spreadsheets.batchUpdate(
    {
      spreadsheetId,
      resource: { requests }
    },
    (err, res) => {
      if (err) {
        log(err);
      } else {
        log(
          "The table was successfully drawn on the sheet",
          emojis.coolGlasses
        );
        log(res.data);
      }
    }
  );
};

const getNextColumnNum = (spreadsheetId, range) => {
  return new Promise(async (res, rej) => {
    const sheets = await getAuthenticatedSheet();
    sheets.spreadsheets.values.get(
      {
        spreadsheetId,
        range
      },
      (err, result) => {
        if (err) rej("The API returned an error: " + err);
        const rows = result.data.values;
        const obj = { start: rows[0].length, end: rows[0].length + 1 };
        res(obj);
      }
    );
  });
};

const getNextAlphRange = columnNo => {
  const upperCaseAlp = ALPHABETS.UPPERCASE;
  let nextCol = "";

  if (columnNo >= 1 && columnNo <= 26) {
    nextCol = "!" + upperCaseAlp[columnNo] + "1";
  } else if (columnNo >= 27 && columnNo <= 52) {
    nextCol = "!A" + upperCaseAlp[columnNo] + "1";
  } else if (columnNo >= 53 && columnNo <= 78) {
    nextCol = "!B" + upperCaseAlp[columnNo] + "1";
  } else if (columnNo >= 79 && columnNo <= 104) {
    nextCol = "!C" + upperCaseAlp[columnNo] + "1";
  }

  return nextCol;
};

const updateStatistics = async (spreadsheetId, SHEET, DATA) => {
  const nextColNum = await getNextColumnNum(spreadsheetId, SHEET.NAME);

  await drawTableBorder(
    spreadsheetId,
    SHEET.ID,
    nextColNum.start,
    nextColNum.end
  );

  const nextAlphRange = getNextAlphRange(nextColNum.start);

  const range = SHEET.NAME + nextAlphRange;
  console.log("data", DATA);

  await statisticsToSheet(spreadsheetId, range, DATA);
};

module.exports = updateStatistics;
