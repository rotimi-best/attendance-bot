const { log } = console;
const { date, len, emojis, getAuthenticatedSheet } = require("./index");
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
      if (err)
        return log("companyspreadsheet The API returned an error: " + err);
      else log("Pushed into sheet", result.data);
    }
  );
};

const styleSheet = async (
  spreadsheetId,
  sheetId,
  endRowIndex,
  startColumnIndex,
  endColumnIndex
) => {
  const sheets = await getAuthenticatedSheet();
  const number = 0;
  const requests = [];

  // Align text center
  requests.push({
    repeatCell: {
      range: {
        sheetId: sheetId,
        startRowIndex: 0,
        endRowIndex,
        startColumnIndex: startColumnIndex,
        endColumnIndex: endColumnIndex
      },
      cell: {
        userEnteredFormat: {
          horizontalAlignment: "CENTER"
        }
      },
      fields: "userEnteredFormat.horizontalAlignment"
    }
  });

  // Draw border
  requests.push({
    updateBorders: {
      range: {
        sheetId: sheetId,
        startRowIndex: 0,
        endRowIndex,
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

  // Make first row frozen
  requests.push({
    updateSheetProperties: {
      properties: { gridProperties: { frozenRowCount: 1 } },
      fields: "gridProperties.frozenRowCount"
    }
  });

  // Make first row bold
  requests.push({
    repeatCell: {
      range: {
        sheetId,
        startRowIndex: 0,
        endRowIndex: 1
      },
      cell: {
        userEnteredFormat: {
          textFormat: { bold: true }
        }
      },
      fields: "userEnteredFormat.textFormat.bold"
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
      }
    }
  );
};

const getColumnNum = (spreadsheetId, range, next = true) => {
  return new Promise(async (res, rej) => {
    const sheets = await getAuthenticatedSheet();
    sheets.spreadsheets.values.get(
      {
        spreadsheetId,
        range
      },
      (err, result) => {
        if (err) rej("The API returned an error: " + err);
        const rows = result.data.values || [[]];
        let obj = {};

        if (next) {
          obj = {
            start: rows[0].length,
            end: rows[0].length + 1
          };
        } else {
          obj = {
            start: rows[0].length - 1,
            end: rows[0].length
          };
        }

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

const updateStatistics = async (spreadsheetId, SHEET, DATA, nextColumn) => {
  const nextColNum = await getColumnNum(spreadsheetId, SHEET.name, nextColumn);

  console.log("Next columns", nextColNum);

  await styleSheet(
    spreadsheetId,
    SHEET.id,
    len(DATA),
    nextColNum.start,
    nextColNum.end
  );

  const nextAlphRange = getNextAlphRange(nextColNum.start);
  console.log("Next nextAlphRange", nextAlphRange);

  const range = SHEET.name + nextAlphRange;
  log("data", DATA);

  await statisticsToSheet(spreadsheetId, range, DATA);
};

module.exports = updateStatistics;
