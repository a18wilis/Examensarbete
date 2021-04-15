import React from 'react';
import ReactDOM from 'react-dom';
import * as simpleheat from 'simpleheat';
import './index.css';

//Create heatmap canvas
class Heatmap extends React.Component {
    render() {
        return ( <
            canvas id = "canvas"
            width = "1000"
            height = "600" > < /canvas> 
        )
    }

    //If heatmap canvas is created, load scripts
    componentDidMount() {

        var files = ['./owid-covid-data_040521.json', './countries.json'];

        var iso = [];
        var cases = [];
        var coordinates = [];
        var mapData = [];
        var filteredData = [];

        //Load JSON-file containing datasets
        function loadJSON(callback, jsonFile) {
            var xObj = new XMLHttpRequest();
            xObj.overrideMimeType("application/json");
            //Retrieve the file
            xObj.open('GET', jsonFile, true);
            xObj.onreadystatechange = function () {
                if (xObj.readyState === 4 && xObj.status === 200) {
                    //Call the callback-function
                    callback(xObj.responseText);
                }
            };
            xObj.send(null);
        }
        
        //Format Date-variable to string (YYYY-MM-DD)
        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }

        // Convert JSON to string and store it
        // Extract ISO-codes and total cases
        loadJSON(function (response) {
            // Parse JSON string to JSON object
            var json = JSON.parse(response);

            // Push ISO-codes to array
            for (var i = 0; i < Object.keys(json).length; i++) {
                iso.push(Object.keys(json)[i]);
            }

            // Extract location-name and total cases for each ISO-code
            var locForMap = [];
            var start = new Date('2020-02-24'); //Collect data starting from start date
            var end = new Date('2021-04-04');   //up until end date
            var formatted;

            for (var i = 0; i < iso.length; i++) {
                for (var j = 0; j < coordinates.length; j++) {
                    if (coordinates[j][0] == json[iso[i]].location) {
                        locForMap[i] = coordinates[j][0];
                        var loop = new Date(start);
                        while (loop <= end) {
                            formatted = formatDate(loop);
                            for (var k = 0; k < json[iso[i]].data.length; k++) {
                                if (json[iso[i]].data[k].date === formatted) {
                                    cases[i] = +parseInt(json[iso[i]].data[k].total_cases);
                                }
                            }
                            var newDate = loop.setDate(loop.getDate() + 1);
                            loop = new Date(newDate);
                        }
                    }
                }
            }
            console.log("Fetchted total cases in " + cases.length + " locations between " + formatDate(start) + " and " + formatDate(end));
            for (i = 0; i < locForMap.length; i++) {
                for (j = 0; j < coordinates.length; j++) {
                    if (locForMap[i] == coordinates[j][0]) {
                        mapData[i] = [coordinates[j][1], coordinates[j][2], cases[i]];
                    }
                }
            }

            // Draw heatmap after data has been gathered
            // Filter null-values from mapdata before adding to heatmap
            filteredData = mapData.filter(function (el) {
                return el != null;
            });
            console.log("Collected Data:");
            console.log(filteredData);
            var heat = simpleheat('canvas').max(1000000).data(filteredData);

            //Change radius, for testing
            heat.radius(25, 10);

            heat.gradient({
                0.25: 'blue',
                0.50: 'lime',
                0.75: 'yellow',
                1.0: 'red'
            });

            function draw() {
                heat.draw();
            }
            draw();
        }, files[0]);

        loadJSON(function (response) {
            // Parse JSON string to JSON object
            var json = JSON.parse(response);

            //Extract latitude and longitude coordinates from all locations
            for (var i = 0; i < json.length; i++) {
                coordinates.push([json[i].name, parseInt(json[i].latitude), parseInt(json[i].longitude)]);
            }
        }, files[1]);
    }
}

ReactDOM.render( <
    Heatmap / > ,
    document.getElementById('heatmap')
);