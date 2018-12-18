const { getAuthenticatedSheet } = require("../modules");

const createNewSpreadSheet = async title => {
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
        console.log(err);
      } else {
        console.log(spreadsheet);
      }
    }
  );
};

const addSheetWithStudents = () => {};

module.exports = {
  createNewSpreadSheet,
  addSheetWithStudents
};
