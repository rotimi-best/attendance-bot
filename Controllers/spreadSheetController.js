const { authenticatedSheet } = require("../modules");

const createNewSpreadSheet = async title => {
  const resource = {
    properties: {
      title
    }
  };

  const sheets = await authenticatedSheet();

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
