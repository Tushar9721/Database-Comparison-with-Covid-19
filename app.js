const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const mysql = require("mysql");

const app = express();

app.set("view engine", "ejs");

//setting body parser and accessing the static files..
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var mysqlConnection = mysql.createConnection({
  host:"localhost",
  user: "root",
  password:"root",
  database: "database",
  insecureAuth: true
});

mysqlConnection.connect((err)=>{

  if(!err){
    console.log("Done");
  }
  else{
    console.log(err);
  }

});
// //connecting with mongo
// mongoose.connect("mongodb://localhost:27017/covidDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// //creating schema
// const caseSChema = {
//   countryName: String,
//   date: String,
//   recentCases: String,
//   lastCases: String,
//   recetnDeaths: String,
//   lastDeath: String,
// };

// const Case = mongoose.model("Case", caseSChema);

//getting the home route..
app.get("/", function (req, res) {

  res.render("comparison");

  // const covid_case = new Case({
  //   countryName: "India",
  //   date: "202020",
  //   recentCases: "20202",
  //   lastCases: "1202",
  //   recetnDeaths: "12",
  //   lastDeath: "23",
  // });

  // covid_case.save(function (err) {
  //   if (!err) {
  //     console.log("DOne");
  //     res.render("comparison");
  //   }
  // });
 
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
