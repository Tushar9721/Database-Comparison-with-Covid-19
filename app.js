const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const { count } = require("console");

const app = express();

app.set("view engine", "ejs");

//setting body parser and accessing the static files..
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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
          const covidData = JSON.parse(data);
          console.log(covidData.length);
          const countryData = covidData.CAN;
          console.log(countryData.location);
          console.log(countryData.population);
          var i = 0;
          var length = countryData.data.length;
          console.log(countryData.data[length - 1].date);
          console.log(countryData.data[length - 1].total_cases);

          console.log(countryData.data[length - 2].date);
          console.log(countryData.data[length - 2].total_cases);

          //  // for loop to get the data from array.
          //   for (i in countryData.data) {
          //     console.log(countryData.data[i].date);
          //     console.log(countryData.data[i].total_cases);
          //   }
        });
      }
    )
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
  res.render("comparison");
});


//getting the cases request...
app.get("/cases", function (req, res) {
  res.render("cases");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port " + port);
});
