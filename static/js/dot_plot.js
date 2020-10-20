// When the button is changed, run the updateChart function
d3.select("#yearDropdown").on("change", function (d) {
    // recover the option that has been chosen
    var selectedYear = d3.select(this).property("value")
    
    var selectedFuel = d3.select("#fuelDropdown").property("value");  // obtain the current value of the fuel type dropdown
    // run the updateChart function with this selected option
    // extract the data for the year selected by user  
    updateTable(selectedYear, selectedFuel)
});

var selectedFuel = "all";     //default fuel type is set to all fuel types
var selectedYear = 2019;

// When the button is changed, run the updateChart function
d3.select("#fuelDropdown").on("change", function (d) {
    // recover the option that has been chosen
    var selectedFuel = d3.select(this).property("value");
    var selectedYear = d3.select("#yearDropdown").property("value");  // obtain the current value of the year dropdown
    updateTable(selectedYear, selectedFuel)
});

var masterData
function updateTable(year, selectedFuel) {
    keys = masterData.columns.slice(4, 12, masterData.columns.length - 2); //exclude the total_fuel_user column
    var yearData = getFilteredData(masterData, year);
    d3.select("#chart").html("");
    d3.select("#chartTitle").html("");
    d3.select("#legend").html("");
    render(yearData, keys, selectedFuel);
}
var data = d3.csv("./static/data/final_dataset_101520.csv")
    .then(data => {
        data.forEach(d => {
            d.total_fuel_user = +d.total_fuel_user;
            d.utilitygas = +d.utilitygas / d.total_fuel_user;
            d.bottled_tank = +d.bottled_tank / d.total_fuel_user;
            d.electricity = +d.electricity / d.total_fuel_user;
            d.fueloil = +d.fueloil / d.total_fuel_user;
            d.wood = +d.wood / d.total_fuel_user;
            d.solar = +d.solar / d.total_fuel_user;
            d.other_fuel = +d.other_fuel / d.total_fuel_user;
            d.coal_coke = +d.coal_coke / d.total_fuel_user;
        });
        masterData = data;
        
        var allYears = new Set(data.map(d => +d.year));
        // add the options to the year drop-down button
        d3.select("#yearDropdown")
            .selectAll('myOptions')
            .data(allYears)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; }); // corresponding value returned by the button

        updateTable(selectedYear, selectedFuel);

        // add the options to the fuel drop-down button
        d3.select("#fuelDropdown")
            .selectAll('myOptions')
            .data(keys)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; }); // corresponding value returned by the button

    });

// Get a subset of the data based on the group
function getFilteredData(data, year) {
    return data.filter(function (d) { return d.year == year; });
    
}

function update(states) {
    const index = d3.range(states.length);

    const order = fuelDropdown === "wood" ? d3.ascending : d3.descending;
    index.sort((i, j) => order(states[i][fuelDropdown], states[j][fuelDropdown]));
    return chart;
}

function render(yearData, keys, selectedFuel) {
    var margin = ({ top: 20, right: 10, bottom: 10, left: 95 });
    var height = yearData.length * 16;
    var width = margin.left + 742 + margin.right;

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeTableau10);

    // add a legend
    // select the svg area
    var svg = d3.select("#legend")

    // Add one dot in the legend for each name.
    svg.selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
        .attr("cx", function(d,i){ return width/2 + i*65 + margin.left}) // 25 is where the first dot appears. 100 is the distance between dots
        .attr("cy", 20) 
        .attr("r", 4)
        .style("fill", function(d){ return color(d)})

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", function(d,i){ return width/2 + i*65 + margin.left})
        .attr("y", 6) 
        .attr("text-anchor", "middle")
        .text(function(d){ return d})
        .style("alignment-baseline", "middle")

    x = d3.scaleLinear()
        .domain([-0.01, d3.max(yearData, d => d3.max(keys, k => d[k]))])
        .rangeRound([margin.left, width - margin.right])

    y = d3.scalePoint()
        .domain(yearData.map(d => d.state).sort(d3.ascending))
        .rangeRound([margin.top, height - margin.bottom])
        .padding(1)

    xAxis = g => g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(null, "%"))
        .call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("y2", height - margin.bottom))
        .call(g => g.selectAll(".domain").remove());

    const c = chart();
    (async () => {
        for await (const val of c) {
            console.log(val);
        }
    })();

    async function* chart() {
       
        const svg = d3.select("#chart").append("svg")
            .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .call(xAxis);

        const g = svg.append("g")
            .attr("text-anchor", "end")
            .style("font", "10px sans-serif")
            .selectAll("g")
            .data(yearData)
            .join("g")
            .attr("transform", (d, i) => `translate(0,${y(d.state)})`);

        g.append("line")
            .attr("stroke", "#aaa")
            .attr("class", "gridline")
            .attr("x1", d => x(d3.min(keys, k => d[k])))
            .attr("x2", d => x(d3.max(keys, k => d[k])));
        
            var labelUse = "Use:";
            var labelState = "State:";
            var labelFuel = "Fuel :"
            var formatPercent = d3.format(".2%");
    
            var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 30])
                .html(function ([k ,d]) {
                    return (`${labelState} ${d.state}<br>${labelFuel} ${k}<br>${labelUse} ${formatPercent(d[k])}`);
                })
            g.call(tip);
    
            // append initial circles
            var dots = g.selectAll("circle")
                .data(d => d3.cross(keys, [d]))
                .join("circle")
                .attr("cx", ([k, d]) => x(d[k]))
                .attr("fill", ([k]) => color(k))
                .attr("r", 4)
                .classed("fuelCircle", function () {
                    if (selectedFuel === "all") {       // highlight all circles at the beginning
                        return true;
                    }
                    return false;
                })
                .classed("active", function ([k]) {
                    if (k === selectedFuel && selectedFuel !== "all") {    // highlight the selected fuel type only
                        return true;
                    }
                    return false;
                })
                .classed("inactive", function ([k]) {
                    if (k !== selectedFuel && selectedFuel !== "all") {    // dim the other fuel types that are not selected
                        return true;
                    }
                    return false;
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
    
            dots.transition()
                .duration(500)
                .delay(100);
    
            g.append("text")
                .attr("dy", "0.35em")
                .attr("style", "bold")
                .attr("x", margin.left)
                .text((d, i) => d.state);
    
            // add chart title
            d3.select("#chart-title").append("text")
                .attr("dy", "0.55em")
                .attr("style", "bold")
                .attr("x", width/2 + margin.left)
                .attr("y", 5)
                .text("House Heating Fuel Types")
                .classed("chartTitleText", true);
    
            g.exit().remove();

        return Object.assign(svg.node(), {
            update(states) {
                y.domain(states);

                g.transition()
                    .delay((d, i) => i * 10)
                    .attr("transform", d => `translate(0,${y(d.state)})`)
            }
        });
    
    }
}
