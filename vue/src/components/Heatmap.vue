<template>
  <canvas id='canvas'/>
</template>
<script src='../public/simpleheat.js'></script>

<script>
import * as simpleheat from './simpleheat.js';

export default {
    name: 'Heatmap',
    mounted() {
        this.init();
    },
    methods: {
        init() {
        
            //Load JSON-file containing dataset
            var files = ['https://raw.githubusercontent.com/a18wilis/Examensarbete/main/dataset/owid-covid-data_040521.json', 'https://raw.githubusercontent.com/a18wilis/Examensarbete/main/dataset/countries.json'];
            
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
                var index;
                var test = 0;
                var locForMap = [];
                for (var i = 0; i < iso.length; i++) {
                    for (var j = 0; j < coordinates.length; j++) {
                        if (coordinates[j][0] == json[iso[i]].location) {
                            index = coordinates.indexOf(coordinates[j][0]);
                            locForMap[i] = coordinates[j][0];
                            for(var k = 0; k < json[iso[i]].data.length; k++){
                                if(json[iso[i]].data[k].date === '2020-03-26'){
                                    test++;
                                    cases[i] = (parseInt(json[iso[i]].data[k].total_cases));
                                }
                            }
                        }
                    }
                };
                for (var i = 0; i < locForMap.length; i++) {
                    for (var j = 0; j < coordinates.length; j++) {
                        if (locForMap[i] == coordinates[j][0]) {
                            mapData[i] = [coordinates[j][1], coordinates[j][2], cases[i]];
                        }
                    }
                };
            }, files[0]);
            loadJSON(function (response) {
                // Parse JSON string to JSON object
                var json = JSON.parse(response);

                //Extract latitude and longitude coordinates from all locations
                for (var i = 0; i < json.length; i++) {
                    coordinates.push([json[i].name, parseInt(json[i].latitude), parseInt(json[i].longitude)]);
                }
            }, files[1]);

            // Add delay to heatmap render in order to let mapData configure
            setTimeout(function () {

                // Filter null-values from mapdata before adding to heatmap
                filteredData = mapData.filter(function (el) {
                    return el != null;
                });
                
                var heat = simpleheat('canvas').max(100000).data(filteredData);
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

                //Change radius and blur functions (Not removed since they may be used to measure scalability)
                var radius = get('radius'),
                    blur = get('blur'),
                    changeType = 'oninput' in radius ? 'oninput' : 'onchange';

                radius[changeType] = blur[changeType] = function (e) {
                    heat.radius(+radius.value, +blur.value);
                    frame = frame || window.requestAnimationFrame(draw);
                }

            }, 1000);

            function get(id) {
                return document.getElementById(id);
            };
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#canvas{

}
</style>
