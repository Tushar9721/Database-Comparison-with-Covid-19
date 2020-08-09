//getting the values from thml file
//getting the value..
var readMongo = parseInt(document.getElementById("readM").innerHTML);
var insertMongo = parseInt(document.getElementById("insertM").innerHTML);
var upadMongo = parseInt(document.getElementById("upadM").innerHTML);
var delMongo = parseInt(document.getElementById("delM").innerHTML);
var readSql = parseInt(document.getElementById("readS").innerHTML);
var upadSql = parseInt(document.getElementById("upadS").innerHTML);
var delSql = parseInt(document.getElementById("delS").innerHTML);
var insertSql = parseInt(document.getElementById("insertS").innerHTML);

window.onload = function () {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light3",
    exportEnabled: true,
    axisY: {
      includeZero: false,
    },
    data: [
      {
        type: "spline",
        name: "MongoDb",
        lineColor: "CadetBlue",
        showInLegend: true,
        indexLabelFontSize: 16,
        dataPoints: [
          {
            label: "Inserting",
            y: insertMongo,
          },
          {
            label: "Reading",
            y: readMongo,
          },
          {
            label: "Updating",
            y: upadMongo,
          },
          {
            label: "Deletion",
            y: delMongo,
          },
        ],
      },
      {
        type: "spline",
        name: "SQL",
        lineColor: "DarkSlateGray",
        showInLegend: true,
        indexLabelFontSize: 16,
        dataPoints: [
          {
            label: "Inserting",
            y: insertSql,
          },
          {
            label: "Reading",
            y: readSql,
          },
          {
            label: "Updating",
            y: upadSql,
          },
          {
            label: "Deletion",
            y: delSql,
          }, 
        ],
      },
    ],
  });
  chart.render();
};
