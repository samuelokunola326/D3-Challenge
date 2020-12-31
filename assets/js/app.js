// establishing svg width and height 

var svgWidth = 1100;
var svgHeight = 700;

// setting margin for the svg element 

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 120,
};


// setting width and height relative to svg margins set up 

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// creating svg element to hold charts and add groups to

var svg = d3
.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight)
.attr("class", "chart");


// append svg group to chart element and set chart placement

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left, margin.top})`);


// choosing an initial axis to load for both x and y

var chosenAxisX = "poverty";

var chosenAxisY = "obesity";


// function used to create the scales for x  and y axis with dynamically

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
        .attr("cy", d => newYScale(d[chosenAxisY]));

    return circlesGroup;
}

// creating tooltip and formatting tool tip data
var toolTip = d3.tip()
.attr("class", "d3-tip")
.offset([80, -60])
.html(function(d) {

    if (chosenAxisX === "poverty") {
        x = `${d[chosenAxisX]}%`
        
    }
    else {
        x = `${parseFloat(d[chosenAxisX]).toLocaleString("en")}`
    }
    return (`${d.state}<br>${chosenAxisX} : ${x}<br>${chosenAxisY} : ${d[chosenAxisY]}%`)
});




// Function used to update tool tips

function updateToolTip(chosenAxisX, chosenAxisY, circlesGroup) {

   

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this)
    })

        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}


// importing dataset 
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    // mutating data imported from srings to integers 

    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age
        data.income = +data.income
        data.obesity = +data.obesity
        data.smokes = +data.smokes
        data.healthcare = +data.healthcare

    });

// init call to scale data with default options 
    var xLinearScale = xScale(data, chosenAxisX);
    var yLinearScale = yScale(data, chosenAxisY);

    // creating initial axis 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// add x axis to chart group and place at bottom of chart 
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(80, ${height + 20})`)
        .call(bottomAxis);

// add y axis to chart group and place to the left of chart 
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(${width * 0 + 80}, 20)`)
        .call(leftAxis);


// creating a function for the radius of the circle 
var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// creating circles 
    var circlesGroup = chartGroup.selectAll("g circleGroup")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenAxisX]))
        .attr("cy", d => yLinearScale(d[chosenAxisY]))
        .attr("r", circRadius)
        .attr("class", function(d) {
            return "stateCircle " + d.abbr;
          })
        .attr("opacity", ".5")


        //   appendding state abbr to circles 
        chartGroup.selectAll("g circleGroup")
        .data(data)
        .enter()
        .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
        .text(function(d) {
            return d.abbr;
        })
        // Now place the text using our scale.
        .attr("dx", function(d) {
        return xLinearScale(d[chosenAxisX]);
        })
        .attr("dy", function(d) {
        // When the size of the text is the radius,
        // adding a third of the radius to the height
        // pushes it into the middle of the circle.
        return yLinearScale(d[chosenAxisY]) + circRadius / 2.5;
        })
        .attr("font-size", circRadius)
        .attr("class", "stateText")



        //  Create a group for x axis lables in order to makes some changes to them
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 1.80}, ${height + 20})`);

    
    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty (%)");


    var ageLabel = labelsGroup.append("text")
        .attr("y", 60)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var houseIncomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Median Income (Median)");

    
    //  Create a group for y axis lables in order to makes some changes to them
    var labelsGroupY = chartGroup.append("g")
        .attr("transform", `translate(${height * 0}, ${width / 3})`);

    
    var obeseLabel = labelsGroupY.append("text")
        .attr("x", 40)
        .attr("y", 0)
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obese (%)");


    var smokesLabel = labelsGroupY.append("text")
        .attr("x", 40)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");

    var healthcareLabel = labelsGroupY.append("text")
        .attr("x", 60)
        .attr("y", 40)
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

   

    // updating tool tips for x and y 
    var circlesGroup = updateToolTip(chosenAxisX, chosenAxisY, circlesGroup);
    // var circlesGroup = updateToolTipY(chosenAxisY, circlesGroup);

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
                circlesGroup = updateToolTip(chosenAxisX, chosenAxisY, circlesGroup);

                d3.selectAll(".stateText").each(function() {
                    // We give each state text the same motion tween as the matching circle.
                    d3
                      .select(this)
                      .transition()
                      .attr("dx", function(d) {
                        return xLinearScale(d[chosenAxisX]);
                      })
                      .duration(1000);
                  });
          

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
                circlesGroup = updateToolTip(chosenAxisY, chosenAxisX, circlesGroup);

                d3.selectAll(".stateText").each(function() {
                    // We give each state text the same motion tween as the matching circle.
                    d3
                      .select(this)
                      .transition()
                      .attr("dy", function(d) {
                        return yLinearScale(d[chosenAxisY]);
                      })
                      .duration(1000);
                  });


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
    
}).catch(function(error) {
    console.log(error)
});









