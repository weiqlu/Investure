const request = require("supertest");
const { app, excelDateToJSDate, calculateReturn } = require("./app.js");

describe("tests excelDateToJSDate function", function () {
  test("this should convert an excel serial to a date string", () => {
    const serial = 44834;
    const date = excelDateToJSDate(serial);
    expect(date).toBe("9/30/2022");

    const serial2 = 32874;
    const date2 = excelDateToJSDate(serial2);
    expect(date2).toBe("1/1/1990");
  });
});

describe("tests calculateReturn function", function () {
  test("this should return total return for each day given a daily return value", () => {
    const testData = [
      { ReferenceDate: 32875, DailyReturn: 1.7791 },
      { ReferenceDate: 32876, DailyReturn: -0.2564 },
    ];
    const result = calculateReturn(testData);
    expect(result).toEqual([
      { ReferenceDate: "1/2/1990", TotalReturn: "1.7791" },
      { ReferenceDate: "1/3/1990", TotalReturn: "1.5181" },
    ]);
  });
});

describe("tests GET request to /investure", function () {
  test("this should return with a status 200 with the content type as JSON", function () {
    return request(app)
      .get("/investure")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
