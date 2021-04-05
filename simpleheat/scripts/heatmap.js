//Load JSON-file containing dataset
var myFiles = ['https://raw.githubusercontent.com/a18wilis/Examensarbete/main/dataset/owid-covid-latest.json', 'https://raw.githubusercontent.com/a18wilis/Examensarbete/main/dataset/countries.json'];

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
    var locForMap = [];
    for (var i = 0; i < iso.length; i++) {
        for (var j = 0; j < coordinates.length; j++) {
            if (coordinates[j][0] == json[iso[i]].location) {
                index = coordinates.indexOf(coordinates[j][0]);
                locForMap[i] = coordinates[j][0];
                cases[i] = (parseInt(json[iso[i]].total_cases / 1000000));
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
}, myFiles[0]);

loadJSON(function (response) {
    // Parse JSON string to JSON object
    var json = JSON.parse(response);

    //Extract latitude and longitude coordinates from all locations
    for (var i = 0; i < json.length; i++) {
        coordinates.push([json[i].name, parseInt(json[i].latitude), parseInt(json[i].longitude)]);
    }
}, myFiles[1]);

// Add delay to heatmap render in order to let mapData configure
setTimeout(function () {

    // Filter null-values from mapdata before adding to heatmap
    filteredData = mapData.filter(function (el) {
        return el != null;
    });

    var heat = simpleheat('canvas').max(10).data(filteredData);
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

}, 100);

function get(id) {
    return document.getElementById(id);
};