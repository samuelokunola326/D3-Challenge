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
.select(".chart")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);


// append svg group to chart element and set chart placement

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left, margin.top})`);





