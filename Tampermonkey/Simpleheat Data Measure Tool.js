// ==UserScript==
// @name         Simpleheat Data Measure Tool
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Measure Data Values Of Rendered Heatmaps
// @author       William Isaksson
// @match       http://localhost:3000/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

//Create 'Start test!'-button
var btn = document.createElement ('div');
btn.innerHTML = '<button id="getColorBtn" type="button"> Start test!</button>';
btn.setAttribute ('id', 'getColorBtn');
document.body.appendChild (btn);

document.getElementById("getColorBtn").addEventListener("click", function(){
    performTest();
}, false);


//Configurations to be used in tests
var measures = [
    [5, 5],
    [15, 15],
    [25, 25],
    [35, 35],
    [45, 45],
    [5, 15],
    [5, 25],
    [5, 35],
    [5, 45],
    [5, 55],
    [15, 5],
    [25, 5],
    [35, 5],
    [45, 5],
    [55, 5],
    ];

//Start the test
function performTest(){

    //Get radius-inputs and render-button
    const pRad = document.getElementById('prad');
    const bRad = document.getElementById('brad');
    const renderBtn = document.getElementById('renderBtn');

    //Get Average RGB when render button is clicked
    renderBtn.addEventListener("click", getAverageRGB, false);

    //Series numbers for logging
    var series = 1;
    var seriesNr = 1;

    var count = 0;
    var measureCount = 15;
    if(count < measureCount){
        setInterval(function(){
            pRad.value = measures[count][0];
            pRad.dispatchEvent(new Event('input')); //trigger input-event in order to work on vue-app

            bRad.value = measures[count][1];
            bRad.dispatchEvent(new Event('input')); //trigger input-event in order to work on vue-app
            count++;
            renderBtn.click();

            //Log measure-series number in console
            console.log(series + "." + seriesNr)
            seriesNr++
            if(seriesNr > 5){
                series++;
                seriesNr = 1;
            }
        }, 2000);

    }
}

function getAverageRGB() {
    setTimeout(function(){
        var
    imgEl = document.getElementById('canvas'),
    blockSize = 5, // Analyze every 5th pixel
        defaultRGB = {r:255,g:153,b:0}, // Set defaultRGB if script doesn't work
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */alert('x');
        return defaultRGB;
    }

    length = data.data.length;
    while ( (i += blockSize * 4) < length ) {

        var allZero = true;
        for(var j = 0; j < 3; j++){
            if(data.data[i+j] != 0){
                allZero = false;
            }
        }

        if(allZero == false){
        ++count;
        /*console.log(data.data[i], data.data[i+1], data.data[i+2]);*/
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
        }
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    // log result in console
    console.log(rgb.r + " " + rgb.g + " " + rgb.b);

    // store result in localStorage for easier sheet usage
    let r= JSON.parse(localStorage.getItem("r"));
    r += ", " + rgb.r;
    localStorage.setItem("r", JSON.stringify(r));

    let g = JSON.parse(localStorage.getItem("g"));
    g += ", " + rgb.g;
    localStorage.setItem("g", JSON.stringify(g));

    let b = JSON.parse(localStorage.getItem("b"));
    b += ", " + rgb.b;
    localStorage.setItem("b", JSON.stringify(b));

    }, 1000);
}