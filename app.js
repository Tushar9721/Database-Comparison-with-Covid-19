const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

//setting body parser and accessing the static files..
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {
    
    res.render("comparison");
});

app.get("/cases",function(req,res){
    res.render("cases");
});

let port = process.env.PORT;
if(port == null || port == ""){
  port= 3000;
}


app.listen(port, function() {
    console.log("Server started on port " + port);
  });
  