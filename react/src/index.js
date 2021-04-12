import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Load external js file into React
function loadScript(scriptPath){
    const script = document.createElement("script");
    script.src = scriptPath;
    script.async = true;
    document.body.appendChild(script);
}

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
        loadScript("../public/simpleheat.js");
        loadScript("../public/heatmap.js")
    }
}

ReactDOM.render( <
    Heatmap / > ,
    document.getElementById('heatmap')
);