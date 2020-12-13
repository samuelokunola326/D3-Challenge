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

// creating a function that renders circles to be redrawn for both x and y axis

function renderCirclesX(circlesGroup, newXScale, chosenAxisX) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenAxisX]));

    return circlesGroup;
}

function renderCirclesY(circlesGroup, newYScale, chosenAxisY) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newYScale(d[chosenAxisY]));

    return circlesGroup;
}

// Function used to update tool tips

function updateToolTipX(chosenAxisX, circlesGroup) {

    var label;

    if (chosenAxisX === "poverty") {
        label = "poverty";
    }
    else if (chosenAxisX === "Age") {
        label = "Age (Median)";
    }
    else {
        label = "Household Income (Median)";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${label} ${d[chosenAxisX]}`)
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}


function updateToolTipY(chosenAxisY, circlesGroup) {

    var label;

    if (chosenAxisY === "obesity") {
        label = "Obese";
    }
    else if (chosenAxisY === "Smokes") {
        label = "Smokes";
    }
    else {
        label = " Lacks Healthcare";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${label} ${d[chosenAxisY]}`)
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}


d3.csv("data/data").then(function(data, err) {
    if (err) throw err;


    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age
        data.income = +data.income
        data.obesity = +data.obesity
        data.smokes = +data.smokes
        data.heathcare = +data.heathcare
 
    });


    var xLinearScale = xScale(data, chosenAxisX);
    var yLinearScale = yScale(data, chosenAxisY);

    // creating initial axis 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);


    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(${width}, 0)`)
        .call(leftAxis);


    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .append("text", d => text(d.abbr))
        .attr("cx", d => xLinearScale(d[chosenAxisX]))
        .attr("cy", d => yLinearScale(d[chosenAxisY]))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("opacity", ".3");

        //  Create a group for x axis lables in order to makes some changes to them
    var labelsGroup = chartGroup.append("g")
        attr("transform", `translate(${width / 2}, ${height + 20})`);

    
    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("# poverty %");


    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("# Median Age");

    var houseIncomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("# Median Income");

    
    //  Create a group for y axis lables in order to makes some changes to them
    var labelsGroupY = chartGroup.append("g")
        attr("transform", `translate(${height / 2}, ${width + 20})`);

    
    var obeseLabel = labelsGroupY.append("text")
        .attr("x", 20)
        .attr("y", 0)
        .attr("value", "obesity")
        .classed("active", true)
        .text("# Obese %");


    var smokesLabel = labelsGroupY.append("text")
        .attr("x", 40)
        .attr("y", 0)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("# Smokes");

    var healthcareLabel = labelsGroupY.append("text")
        .attr("x", 60)
        .attr("y", 0)
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("# Lacks Healthcare");


        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text()

        // updating tool tips for x and y 
        var circlesGroup = updateToolTipX(chosenAxisX, circlesGroup);
        var circlesGroup = updateToolTipY(chosenAxisY, circlesGroup);

        labelsGroup.selectAll("text")
            .on("click", function() {
                // get value of selection 
                var value = d3.select(this).attr("value");
                if (value !== chosenAxisX) {

                    // replace chosenAxisX with new value
                    chosenAxisX = value;

                    xLinearScale = xScale(data, chosenAxisX);

                    // update x axis with transition
                    xAxis = renderXAxes(xLinearScale, xAxis);

                    // updating circles with new x values
                    circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenAxisX);

                    // update tool tips with new info 
                    circlesGroup = updateToolTipX(chosenAxisX, circlesGroup);

                    if(chosenAxisX === "age") {
                        
                        // setting font to bold based on what is clicked
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);

                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        
                        houseIncomeLabel
                            .classed("active", false)
                            .classed("inactive", true)
                    }

                    else if (chosenAxisX === "income") {

                        houseIncomeLabel
                            .classed("active", true)
                            .classed("inactive", false)

                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true)

                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }

                    else {

                        povertyLabel
                            .classed("active",true)
                            .classed("inactive", false)

                        houseIncomeLabel
                            .classed("active", false)
                            .classed("inactive", true)

                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }

                    
                }

     
            });

        labelsGroupY.selectAll("text")
            .on("click", function() {
                    // get value of Y selection 
                var valueY = d3.select(this).attr("value");
                if (valueY !== chosenAxisY) {

                    // replace chosenAxisX with new value
                    chosenAxisY = valueY;

                    yLinearScale = yScale(data, chosenAxisY);

                    // update x axis with transition
                    yAxis = renderYAxes(yLinearScale, yAxis);

                    // updating circles with new x values
                    circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenAxisY);

                    // update tool tips with new info 
                    circlesGroup = updateToolTipY(chosenAxisY, circlesGroup);


                    if(chosenAxisY === "smokes") {
                        
                        // setting font to bold based on what is clicked
                        smokesLabel
                            .classed("active", true)
                            .classed("inactive", false);

                        obeseLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true)
                    }

                    else if (chosenAxisY === "healthcare") {

                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false)

                        obeseLabel
                            .classed("active", false)
                            .classed("inactive", true)

                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }

                    else {

                        obeseLabel
                            .classed("active",true)
                            .classed("inactive", false)

                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true)

                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }

                    
                }




            });




    


    


})









