import React from 'react';
import ReactDOM from 'react-dom';
import * as simpleheat from 'simpleheat';
import './index.css';


//Create heatmap canvas
class Heatmap extends React.Component {
    //If heatmap canvas is created, load scripts

    renderMap() {

        var files = ['./owid-covid-data_040521.json', './countries.json'];

        var iso = [];
        var cases = [];
        var coordinates = [];
        var mapData = [];
        var filteredData = [];
        
        function get(id) {
            return document.getElementById(id).value;
        }

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

            //Access array of every country by ISO-code
            for (var i = 0; i < iso.length; i++) {
                for (var j = 0; j < coordinates.length; j++) {
                    if (coordinates[j][0] == json[iso[i]].location) {
                        locForMap[i] = coordinates[j][0];

                        //Get total cases for every country
                        json[iso[i]].data.forEach(function (obj) {
                            if (Object.keys(obj).includes("total_cases")) {
                                cases[i] = ++obj.total_cases;
                            }
                        })
                        console.log(iso[i] + " " + cases[i]);
                    }
                }
            }

            console.log("Fetchted total cases in " + cases.length);

            //Push coordinates and total cases data to a single array
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

            //Set radius to given value from form
            heat.radius(get('prad'), get('brad'));

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

    render() {
        return (
            <div>
                <canvas id = "canvas" width = "1000" height = "600" > < /canvas>
                Point Radius: <input type = "number" id ="prad"/>
                Blur Radius: <input type = "number" id ="brad"/>
                <button onClick = {this.renderMap}> Render </button>
            </div>
        )
    }
}

ReactDOM.render( 
        <Heatmap/ >,
    document.getElementById('heatmap')
);