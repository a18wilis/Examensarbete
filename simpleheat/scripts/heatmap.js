//Load JSON-file containing dataset
    function loadJSON(callback) {
        var xObj = new XMLHttpRequest();
        xObj.overrideMimeType("application/json");
        //Retrieve the file
        xObj.open('GET', 'https://raw.githubusercontent.com/a18wilis/Examensarbete/main/dataset/owid-covid-latest.json', true);
        xObj.onreadystatechange = function() {
            if (xObj.readyState === 4 && xObj.status === 200) {
                //Call the callback-function
                callback(xObj.responseText);
            }
        };
        xObj.send(null);
    }

    // Convert JSON to string and store it
    // Extract ISO-codes and total cases
    loadJSON(function(response) {
        
        // Parse JSON string to JSON object
        console.log('response =', response);
        var json = JSON.parse(response);
        console.log('your local JSON =', JSON.stringify(json, null, 4));
        
       
        
        // Push ISO-codes to array
        var iso = [];
        for(var i = 0; i < Object.keys(json).length; i++){
            iso.push(Object.keys(json)[i]);
        }

        // Extract total cases by ISO-code
        var cases = [];
        for(var i = 0; i < iso.length; i++){
            // Divide to recieve value between 0 and 1.0
            cases.push((json[iso[i]]["total_cases"] /10000000));
        };
        alert(cases); //For debugging
    });
   
    
    function get(id) {
        return document.getElementById(id);
    }

    var heat = simpleheat('canvas').max(1000000),frame;
    heat.gradient({0.25: 'blue', 0.50: 'lime', 0.75: 'yellow', 1.0: 'red'});
    
    function draw() {
        heat.draw();
        frame = null;
    }

    draw();

    get('canvas').onmousemove = function(e) {
        heat.add([e.layerX, e.layerY, 1]);
        frame = frame || window.requestAnimationFrame(draw);
    };

    var radius = get('radius'),
        blur = get('blur'),
        changeType = 'oninput' in radius ? 'oninput' : 'onchange';

    radius[changeType] = blur[changeType] = function(e) {
        heat.radius(+radius.value, +blur.value);
        frame = frame || window.requestAnimationFrame(draw);
    };