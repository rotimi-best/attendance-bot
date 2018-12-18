const { getAuthenticatedSheet } = require("../modules");
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
          res(spreadsheet);
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
      async (err, res) => {
        if (err) rej("createNewSheet Error: " + err);

        const sheet_id = res.data.replies[0].addSheet.properties.sheetId;
        console.log("\nCreated New sheet", sheet_id);
        res(sheet_id);
      }
    );
  });
};

const newSheetWithStudents = () => {};

module.exports = {
  createNewSpreadSheet,
  newSheetWithStudents,
  updateSheet
};
