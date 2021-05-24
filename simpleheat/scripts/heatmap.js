function renderMap(){
    var files = ['https://raw.githubusercontent.com/a18wilis/Examensarbete/main/dataset/owid-covid-data_040521.json', 'https://raw.githubusercontent.com/a18wilis/Examensarbete/main/dataset/countries.json'];

        var iso = [];
        var cases = [];
        var coordinates = [];
        var mapData = [];
        var filteredData = [];
        var dataType = get('datatype');
        var startTime;
        var endTime;
        function get(id) {
            return document.getElementById(id).value;
        }
        
        //Set starttime
        startTime = new Date().getTime();

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
                        var c = 0;
                        json[iso[i]].data.forEach(function (obj) {
                            if (Object.keys(obj).includes(dataType)) {
                                switch (dataType) {
                                    case "total_cases":
                                        c = c + obj.total_cases
                                        break;
                                    case "total_deaths":
                                        c = c + obj.total_deaths;
                                        break;
                                    case "people_vaccinated":
                                        c = c + obj.people_vaccinated;
                                        break;
                                }
                            }
                        });
                        cases[i] = c;
                    }
                }
            }
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
            console.log(filteredData);
            var heat = simpleheat('canvas').max(get('max')).data(filteredData);

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
            
            //Set endtime
            endTime = new Date().getTime();

            // Calculate render-time & store in localStorage
            var renderTime = endTime - startTime;
            localStorage.setItem("renderTime", renderTime);
        }, files[0]);

        loadJSON(function (response) {
            // Parse JSON string to JSON object
            var json = JSON.parse(response);

            //Format longitude and latitude to correct X
            function formatLon(lon) {
                lon = (lon * 3.5555);
                return lon;
            }

            function formatLat(lat) {
                lat = (lat * -3.5555);
                return lat;
            }

            //Extract latitude and longitude coordinates from all locations
            for (var i = 0; i < json.length; i++) {
                coordinates.push([json[i].name, formatLon(json[i].longitude), formatLat(json[i].latitude)]);
            }
        }, files[1]);
};
