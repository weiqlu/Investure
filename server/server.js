const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
const xlsx = require("xlsx"); // library to read/use excel files (Sheet.js)
const { getJsDateFromExcel } = require("excel-date-to-js");

// helper function to convert excel serial number to MM/DD/YYYY date format
function ExcelDateToJSDate(serial) {
  return getJsDateFromExcel(serial + 1).toLocaleDateString();
}

app.get("/investure", (req, res) => {
  // reads the S&P spreadsheet
  const workbook = xlsx.readFile("./data/2024SoftwareInternAssignment.xlsx");
  // gets the name of the first sheet (raw data in this case and not totalreturn)
  const sheetName = workbook.SheetNames[0];
  // gets the data from the raw data sheet
  const worksheet = workbook.Sheets[sheetName];
  // converts the worksheet (raw data) to a JSON array of objects
  const data = xlsx.utils.sheet_to_json(worksheet);

  let totalReturn = 1; // default multiplier

  // goes over each object and uses the total return formula
  const output = data.map((item) => {
    const ReferenceDate = ExcelDateToJSDate(item.ReferenceDate); // converts to MM/DD/YYYY date
    const DailyReturn = item.DailyReturn;
    const Add1InPercentSpace = 1 + DailyReturn / 100; // converts daily return to multiplier
    totalReturn *= Add1InPercentSpace; // compound the total return with daily multiplier
    const TotalReturn = ((totalReturn - 1) * 100).toFixed(4); // total return percentage for that day
    return {
      ReferenceDate,
      TotalReturn,
    };
  });
  res.json(output);
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
