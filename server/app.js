const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "https://investure.vercel.app",
  })
);
const xlsx = require("xlsx"); // library to read/use excel files (Sheet.js)
const { getJsDateFromExcel } = require("excel-date-to-js");

// helper function to convert excel serial number to MM/DD/YYYY date format
function excelDateToJSDate(serial) {
  return getJsDateFromExcel(serial + 1).toLocaleDateString();
}

// helper function to calculate the total returns for each day
function calculateReturn(data) {


  let totalReturn = 1; // default multiplier

  // goes over each object and uses the total return formula
  return data.map((item) => {
    const ReferenceDate = excelDateToJSDate(item.ReferenceDate);
    const DailyReturn = item.DailyReturn;
    const Add1InPercentSpace = 1 + DailyReturn / 100; // converts daily return to multiplier
    totalReturn *= Add1InPercentSpace; // compound the total return with daily multiplier
    const TotalReturn = ((totalReturn - 1) * 100).toFixed(4); // total return percentage for that day
    return {
      ReferenceDate,
      TotalReturn,
    };
  });
}

// reads the S&P spreadsheet
const workbook = xlsx.readFile("./data/2024SoftwareInternAssignment.xlsx");
// gets the name of the first sheet (raw data in this case)
const sheetName = workbook.SheetNames[0];
// gets the data from the given sheet's name
const worksheet = workbook.Sheets[sheetName];
// converts the worksheet data to a JSON array
const data = xlsx.utils.sheet_to_json(worksheet);

const output = calculateReturn(data);

// GET endpoint to retrieve the total returns for each day
app.get("/totalreturn", (req, res) => {
  res.json(output);
});

// exported for testing purposes
module.exports = { app, excelDateToJSDate, calculateReturn };
