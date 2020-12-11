// establishing svg width and height 

var svgWidth = 1000;
var svgHeight = 600;

// setting margin for the svg element 

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100,
};


// setting width and height relative to svg margins set up 

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// creating svg element to hold charts and add groups to

var svg = d3
.select(".scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);


// append svg group to chart element and set chart placement

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left, margin.top})`);


// choosing an initial axis to load for both x and y

var chosenAxisX = "poverty";

var chosenAxisY = "obese";


// fuction used to transition x axis with clicks

function xScale(data, chosenAxisX) { 
    
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenAxisX]) *.8,
        d3.max(data, d => d[chosenAxisX]) * 1.2

        ])
        .range([0, width]);

    return xLinearScale;

}


function yScale(data, chosenAxisY) {
    
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenAxisY]) *.8,
        d3.max(data, d => d[chosenAxisY]) * 1.2

        ])
        .range([height, 0]);
    
    return yLinearScale

}


// creating the funtions that will transition the x and y axis 

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis
}

// creating a function that renders circles to be redrawn

function renderCircles(circlesGroup, newXScale, chosenAxisX) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenAxisX]));

    return circlesGroup;
}


function updateToolTip(chosenAxisX, circlesGroup) {

    var label;

    if (chosenAxisX === "poverty") {
        label = "poverty";
    }
    else if (chosenAxisX === "Age") {
        label = "Age (Median)"
    }
    else {
        label = "Household Income (Median)"
    }
}












