const url="/api/v1.0/table";

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 60},
width = 660 - margin.left - margin.right,
height = 440 - margin.top - margin.bottom;

// append the svg object to the body of the page
var titleChunk = d3.select("#title_chunk")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", (height + margin.top + margin.bottom)/5)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

d3.json(url).then(function(data){
    var tableData=data;
    //console.log(tableData);

    // List of groups (here I have one group per column)
    var allStates = d3.map(data, function(d){return(d.state)}).keys()
    console.log(allStates)

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
       .data(allStates)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
      .style("background-color", "#ccc")
//################################################# MAKE LINE CHART################################################
    //A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allStates)
      .range(["yellow"]); //#214869

    var myColor2 = d3.scaleOrdinal()
      .domain(allStates)
      .range(["orange"]); //#b2b7ba

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
               .domain(d3.extent(data, function(d) { return d.year; }))
               .range([ 0, width ]);

    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10));
    

    // Add Y axis
    //If it doesn't work, enter the yMax manually
    var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.smocapi_35ormore_m_perc; })])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5));
    
     // Initialize line with first group of the list
     var line = svg
     .append('g')
     .append("path")
     .datum(data.filter(function(d){return d.state==allStates[0]}))
     .attr("d", d3.line()
         .x(function(d) { return x(d.year) })
         .y(function(d) { return y(+d.smocapi_35ormore_m_perc) })
       )
     .attr("stroke", function(d){ return myColor("valueZ") })
     .style("stroke-width", 4)
     .style("fill", "none")

   var line2 = svg
     .append('g')
     .append("path")
     .datum(data.filter(function(d){return d.state==allStates[0]}))
     .attr("d", d3.line()
         .x(function(d) { return x(d.year) })
         .y(function(d) { return y(+d.smocapi_35more_nm_perc) })
       )
     .attr("stroke", function(d){ return myColor2("valueZ") })
     .style("stroke-width", 4)
     .style("fill", "none");
    
    // A function that update the chart
    function update(selectedGroup) {
    
        // Create new data with the selection?
        var dataFilter = data.filter(function(d){return d.state==selectedGroup})
  
        // Give these new data to update line
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
              .x(function(d) { return x(d.year) })
              .y(function(d) { return y(+d.smocapi_35ormore_m_perc) })
            )
            .attr("stroke", function(d){ return myColor(selectedGroup) })

        line2
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
              .x(function(d) { return x(d.year) })
              .y(function(d) { return y(+d.smocapi_35more_nm_perc) })
            )
            .attr("stroke", function(d){ return myColor2(selectedGroup) })
    };

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)

        // titleChunk.append("text")
        // .attr("x", (width / 2))             
        // .attr("y", 0)
        // .attr("text-anchor", "middle")  
        // .attr("fill", "white")
        // .style("font-size", "24px")  
        // .text(`State Selected: ${selectedOption}`)
        // .attr("transform", "translate(0,60)");

    });

    titleChunk.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0)
        .attr("text-anchor", "middle")  
        .attr("fill", "black")
        .attr("font-weight","900")
        .style("font-size", "24px")  
        .text(`Cost Burden % of House Owner Population By State`);

    titleChunk.append("text")
        .attr("x", (width / 2))             
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("fill", "black")  
        .attr("font-weight","900")
        .style("font-size", "24px")  
        .text("2010-2019");
    
    // titleChunk.append("text")
    //     .attr("x", (width / 2))             
    //     .attr("y", 0)
    //     .attr("text-anchor", "middle")  
    //     .attr("fill", "white")
    //     .style("font-size", "24px")  
    //     .text(`Ownership Costs (SMOCAPI) In ${selectedOption}`);

    // titleChunk.append("text")
    //     .attr("x", (width / 2))             
    //     .attr("y", 40)
    //     .attr("text-anchor", "middle")
    //     .attr("fill", "white")  
    //     .style("font-size", "24px")  
    //     .text("2010-2019"); 
    
    // Handmade legend
    svg.append("circle").attr("cx",20)
          .attr("cy",330).attr("r", 6)
          .style("fill", "yellow"); //#214869
    svg.append("circle")
          .attr("cx",20).attr("cy",360)
          .attr("r", 6).style("fill", "orange"); //#b2b7ba
    svg.append("text")
          .attr("x", 30).attr("y", 330)
          .text("SMOCAPI >35% with mortgage")
          .style("font-size", "15px")
          .style("fill", "black")
          .attr("alignment-baseline","middle");
    svg.append("text")
          .attr("x", 30).attr("y", 360)
          .text("SMOCAPI >35% without mortgage")
          .style("font-size", "15px")
          .style("fill", "black")
          .attr("alignment-baseline","middle");



//################################################# MAKE POLAR AREA CHART################################################
    //grab the botton
    var botton=d3.select("#filter-btn");

    //grab user input values
    var inputYear=d3.select("#year");
    var inputState=d3.select("#state");
    
    function plotPlarea(data,year,state){
  
        var filteredData=data.filter(row => row.year==year && row.state==state);
        console.log(filteredData[0]);

        var reformatFile={}
        reformatFile.values=[];
        var array = reformatFile.values;

        array.push({"name":"Less than $50k","value":filteredData[0].value_50k_less});
        array.push({"name":"$50,000 - $99,999","value":filteredData[0].value_50000to99999});
        array.push({"name":"$100,000 - $149,999","value":filteredData[0].value_100000to149999});
        array.push({"name":"$150,000 - $199,999","value":filteredData[0].vlaue_150000to199999});
        array.push({"name":"$200,000 - $299,999","value":filteredData[0].value_200000to299999});
        array.push({"name":"$300,000 - $499,999","value":filteredData[0].value_300000to499999});
        array.push({"name":"$500,000 - $999,999","value":filteredData[0].value_500000to999999});
        array.push({"name":"More than $1M","value":filteredData[0].value_1M_more});


        var lables=reformatFile.values.map(row=>row.name)

        var data=reformatFile.values.map(row=>row.value);

        var options= {
            responsive: true,
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                postiton:'top',
                fontSize: 25,
                fontColor: 'black',
                fontStyle:'bold',
                padding:15,
                text: `${year} ${state} House Median Values`
            },
            scale: {
                ticks: {
                    beginAtZero: true
                },
                reverse: false
            },
            animation: {
            animateRotate: true,
                animateScale: true
            }
        };

        var canvHolder = document.getElementById('canvas-holder');
        canvHolder.innerHTML = '&nbsp;';
        $('#canvas-holder').append('<canvas id="myChart"><canvas>');

        var ctx = $("#myChart").get(0).getContext("2d");        
        
        // Any of the following formats may be used
        //var ctx = document.getElementById('myChart').getContext("2d");

        var myPlchart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: lables,
                datasets: [{
                    data: data,
                    backgroundColor: [
                     'rgba(255, 99, 132, 0.2)',
                     'rgba(54, 162, 235, 0.2)',
                     'rgba(255, 206, 86, 0.2)',
                     'rgba(75, 192, 192, 0.2)',
                     'rgba(153, 102, 255, 0.2)',
                     'rgba(255, 159, 64, 0.2)',
                     'LightSeaGreen',
                     'tomato'                     
                    ],
                    borderColor: [
                     'rgba(255, 99, 132, 1)',
                     'rgba(54, 162, 235, 1)',
                     'rgba(255, 206, 86, 1)',
                     'rgba(75, 192, 192, 1)',
                     'rgba(153, 102, 255, 1)',
                     'rgba(255, 159, 64, 1)',
                     'white',
                     'white'                     
                    ],
                    borderWidth: 1,
                }]
            },
            options:options
        });

    };

    function initial(){
        plotPlarea(tableData,2018,'California')
    };

    initial();

    //dateField.on("change",plot);
    botton.on("click",updatePlot);

    function updatePlot(){
        //var yearSelected=2019;
        //var stateSelected='Iowa'
        var yearSelected=inputYear.property("value");
        var stateSelected=inputState.property("value");

        console.log(yearSelected);
        console.log(stateSelected);

        //update polar area
        plotPlarea(tableData,yearSelected,stateSelected);
    };
});