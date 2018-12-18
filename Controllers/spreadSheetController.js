const { getAuthenticatedSheet } = require("../modules");

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

const addSheetWithStudents = () => {};

module.exports = {
  createNewSpreadSheet,
  addSheetWithStudents
};
