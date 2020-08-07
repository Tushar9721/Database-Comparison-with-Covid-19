const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const mysql = require("mysql");
const performance = require("perf_hooks").performance;
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();

const app = express();

app.set("view engine", "ejs");

//setting body parser and accessing the static files..
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//creating sql connection..
var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "covid",
  insecureAuth: true,
});

//checking sql connection..
mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Done Done");
  } else {
    console.log(err);
  }
});

//connecting with mongo..
mongoose.connect("mongodb://localhost:27017/covidDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//creating mongo schema..
const caseSChema = {
  countryName: String,
  date: String,
  recentCases: String,
  recentDeaths: String,
};

//creating mongoose model..
const Case = mongoose.model("Case", caseSChema);

//getting the home route..
app.get("/", function (req, res) {
  https
    .get(
      "https://covid.ourworldindata.org/data/owid-covid-data.json",
      (resp) => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", function (chunk) {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", function () {
          //parsing the data
          const covidData = JSON.parse(data);
          var casesValue = Object.values(covidData);
          var totalCases;
          var totalDeaths;
          var locationName;
          var date;
          var insertMongoTimeStart = 0;
          var insertSqlTimeStart = 0;
          var insertMongoTimeEnd = 0;
          var insertSqlTimeEnd = 0;
          var insertMongoTimeTotal = 0;
          var insertSqlTimeTotal = 0;

          for (let i = 0; i < Object.keys(covidData).length; i++) {
            //getting the data into variable from api..
            locationName = casesValue[i].location;
            date = casesValue[i].data[casesValue[i].data.length - 1].date;
            totalCases =
              casesValue[i].data[casesValue[i].data.length - 1].total_cases;
            totalDeaths =
              casesValue[i].data[casesValue[i].data.length - 1].total_deaths;

            //start time of mongo..
            insertMongoTimeStart = window.performance.now();
            //inserting into mongoDB..
            const covid_case = new Case({
              countryName: locationName,
              date: date,
              recentCases: totalCases,
              recentDeaths: totalDeaths,
            });

            //calculating the time to run mongo query..
            insertMongoTimeEnd = window.performance.now();
            insertMongoTimeTotal =
              insertMongoTimeTotal +
              (insertMongoTimeEnd - insertMongoTimeStart);

            //saving data into mongoDB..
            covid_case.save(function (err) {
              if (err) {
                console.log(err);
              }
            });

            //start time of sql..
            insertSqlTimeStart = window.performance.now();
            //inserting in MySQL..
            var sql =
              "insert into casestable values(null,'" +
              locationName +
              "','" +
              date +
              "','" +
              totalCases +
              "','" +
              totalDeaths +
              "')";

            mysqlConnection.query(sql, function (err) {
              if (err) {
                console.log("MySql Error: " + err);
              }
            });
            //calculating the time to run mysql query..
            insertSqlTimeEnd = window.performance.now();
            insertSqlTimeTotal =
              insertSqlTimeTotal + (insertSqlTimeEnd - insertSqlTimeStart);

            i++;
          }
          var checkLength = Object.keys(covidData).length / 2;
          console.log("Mongo Insert Time: " + insertMongoTimeTotal);
          console.log("MySql Insert Time: " + insertSqlTimeTotal);

          res.render("comparison", {
            insertM: (insertMongoTimeTotal*100).toFixed(2),
            insertS: (insertSqlTimeTotal*100).toFixed(2),
          });
        });
      }
    )
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

//getting the cases request...
app.get("/cases", function (req, res) {
  var newCountryCodes = [];
  var todayDate = 0;
  var yesterdayDate = 0;
  var countryName = "";
  var todayTotalCases = 0;
  var todayNewCases = 0;
  var todayTotalDeaths = 0;
  var todayNewDeaths = 0;
  var yesterdayNewDeaths = 0;
  var yesterdayTotalDeaths = 0;
  var yesterdayTotalCases = 0;
  var yesterdayNewCases = 0;

  https
    .get(
      "https://covid.ourworldindata.org/data/owid-covid-data.json",
      (resp) => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", function (chunk) {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", function () {
          //parsing the data
          const covidData = JSON.parse(data);

          // for (let i = 0; i < Object.keys(covidData).length; i++) {
          //   newCountryCodes.push(Object.keys(covidData));
          // }
          console.log(Object.values(covidData)[0].location);
          console.log(
            Object.values(covidData)[0].data[
              Object.values(covidData)[0].data.length - 1
            ]
          );
          console.log(
            Object.values(covidData)[0].data[
              Object.values(covidData)[0].data.length - 2
            ]
          );

          countryData = covidData.CAN;
          var lengthDate = countryData.data.length;

          //setting country Name
          countryName = countryData.location;

          //setting dates
          todayDate = countryData.data[lengthDate - 1].date;
          yesterdayDate = countryData.data[lengthDate - 2].date;

          //setting todays cases data
          todayNewCases = countryData.data[lengthDate - 1].new_cases;
          todayNewDeaths = countryData.data[lengthDate - 1].new_deaths;
          todayTotalCases = countryData.data[lengthDate - 1].total_cases;
          todayTotalDeaths = countryData.data[lengthDate - 1].total_deaths;

          //setting yesterdays cases data
          yesterdayNewCases = countryData.data[lengthDate - 2].new_cases;
          yesterdayNewDeaths = countryData.data[lengthDate - 2].new_deaths;
          yesterdayTotalCases = countryData.data[lengthDate - 2].total_cases;
          yesterdayTotalDeaths = countryData.data[lengthDate - 2].total_deaths;

          res.render("cases", {
            countryTitle: countryName,
            todayDate: todayDate,
            yesterDayDate: yesterdayDate,
            todayTotalDeath: todayTotalDeaths,
            todayNewDeaths: todayNewDeaths,
            todayTotalCases: todayTotalCases,
            todayNewCases: todayNewCases,
            yesterdayNewCases: yesterdayNewCases,
            yesterdayNewDeaths: yesterdayNewDeaths,
            yesterdayTotalCases: yesterdayTotalCases,
            yesterdayTotalDeaths: yesterdayTotalDeaths,
          });
        });
      }
    )
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port " + port);
});
