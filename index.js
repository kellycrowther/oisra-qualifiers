const parse = require("csv-parse");
var fs = require("fs");
var uniqBy = require("lodash/uniqBy");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvData = [];

init();

function init() {
  fs.createReadStream("./test-data.csv")
    .pipe(
      parse({
        delimiter: ",",
        columns: true
      })
    )
    .on("data", function(csvrow) {
      //do something with csvrow
      csvData.push(csvrow);
    })
    .on("end", function() {
      //do something with csvData
      // console.log(csvData);
      const qualifiedKids = findKidsWithThreeRaces(csvData);
      writeQualifiersToCSV(qualifiedKids);
    });
}

function findKidsWithThreeRaces(csvData) {
  const kidsWithThreeRaces = [];
  csvData.forEach((row, rowIndex) => {
    let rowCount = 0;
    csvData.forEach((item, itemIndex) => {
      if (item.fullName === row.fullName) {
        rowCount = rowCount + 1;
      }
      if (rowCount === 3) {
        kidsWithThreeRaces.push(row);
      }
      if (itemIndex + 1 === csvData.length) {
        rowCount = 0;
      }
    });
  });
  const uniqueList = uniqBy(kidsWithThreeRaces, "fullName");
  console.info("KIDS WITH THREE RACES: ", uniqueList);
  return uniqueList;
}

function writeQualifiersToCSV(qualifiedKids) {
  const csvWriter = createCsvWriter({
    path: "./test-qualified-racers.csv",
    header: [
      { id: "firstName", title: "firstName" },
      { id: "lastName", title: "lastName" },
      { id: "fullName", title: "fullName" },
      { id: "school", title: "school" }
    ]
  });

  csvWriter.writeRecords(qualifiedKids).then(() => {
    console.log("...Done");
  });
}

/*
  Packages Used:
  https://www.npmjs.com/package/csv-writer
  https://www.npmjs.com/package/csv-parse

*/
