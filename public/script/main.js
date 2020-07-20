
//getting the values from thml file
   //getting the value..
   var readMongo = parseInt(document.getElementById("readM").innerHTML);
   var upadMongo = parseInt(document.getElementById("upadM").innerHTML);
   var delMongo = parseInt(document.getElementById("delM").innerHTML);
   var readSql = parseInt(document.getElementById("readS").innerHTML);
   var upadSql =parseInt(document.getElementById("upadS").innerHTML);
   var delSql = parseInt(document.getElementById("delS").innerHTML);

  //  //assigning the value.
  //  odometer.innerHTML = value+1;



window.onload = function() {

      var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light3",
        exportEnabled: true,

        axisY: {
          includeZero: false
        },
        data: [{
            type: "spline",
            name: "MongoDb",
            lineColor:"CadetBlue",
            showInLegend: true,
            indexLabelFontSize: 16,
            dataPoints: [{
                label: "Updating",
                y: upadMongo
              },
              {
                label: "Deletion",
                y: delMongo
              },
              {
                label: "Reading",
                y: readMongo
              }
            ]
          },
          {
            type: "spline",
            name: "SQL",
            lineColor:"DarkSlateGray",
            showInLegend: true,
            indexLabelFontSize: 6,
            dataPoints: [{
                label: "Updating",
                y: upadSql
              },
              {
                label: "Deletion",
                y: delSql
              },
              {
                label: "Reading",
                y: readSql
              }
            ]
          }
        ]
      });
      chart.render();


    }

 
  