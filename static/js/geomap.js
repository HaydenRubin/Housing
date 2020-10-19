//map 
const url="/api/v1.0/table";
//alert("WELCOME TO OUR PROJECT")

//return an array of objects with only the selected year
//console.log(yearSelected);

d3.json(url).then(function(data){
    
    var tableData=data;

    //populating dropdown manue
    var selectTag= d3.select("#selDataset");

    //we have select all options tags from inside select tag (which there are 0 atm)
    //and assigned data as to be the base of modelling that selection.
    var options = selectTag.selectAll('option')
                  .data(d3.map(data, function(d){
                      return d.year;
                    }).keys());
    
    //if we had some elements from before, they would be reused, and we could access their
    //selection with just `options`
    options.enter()
        .append('option')
        .attr('value', function(d){
            return d;
        })
        .text(function(d){
            return d;
        });      
//################################################# Make GeoMap ######################################################
    function plotGeomap(data,yearSelected) {

        //create an array of object with targed data
        var filteredData=data.filter(row => row.year==yearSelected);
        console.log(filteredData);

        //create arrays of values to put into the data variable below
        var stateCodes=filteredData.map(row=>row.code);
        var stateNames=filteredData.map(row=>row.state);
        var stateRates=filteredData.map(row=>row.occupied_perc);

        console.log(stateRates);
   
        var traceData = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: stateCodes,
            z: stateRates,
            text: stateNames,
            zmin: 70, //Math.min(unpack(filteredData, 'occupied_perc')),
            zmax: 100,
            colorscale: 'Hot',
            colorbar: {
                title: 'Percentage',
                thinkness: 0.5,
                

            },
            marker: { //outline of states
                line:{
                color: 'rgb(255,255,255)',
                width: 2
                }
            }
        }];
        
        var layout = {
            title: `${yearSelected} US Housing OCCUPANCY RATE by State`,
            geo:{
                scope: 'usa',
                showlakes: true,
                lakecolor: 'rgb(255,255,255)'
            },
            margin:{
                    l: 0,
                    r: 0,
                    b: 30,
                    t: 30,
                    pad: 4
            },
            paper_bgcolor: '#CEE3F6',
            plot_bgcolor: '#CEE3F6'
        };
        
        Plotly.newPlot("geoMap", traceData, layout, {showLink: false});  
    };
//################################################# Make Scatter Plot ######################################################
    function plotScatter(data, yearSelected){

        //create an array of object with targed data
        var filteredData=data.filter(row => row.year==yearSelected);
        console.log(filteredData);

        //create arrays of values to put into the data variable below
        var stateRates=filteredData.map(row=>row.occupied_perc);
        var stateMedval=filteredData.map(row=>row.house_median_value)
        var stateFullname=filteredData.map(row=>row.state);

        console.log(stateRates);
        console.log(stateMedval);

        var trace1 = {
            x: stateRates,
            y: stateMedval,
            mode: 'markers',
            type: 'scatter',
            marker: { 
                size: 15,
                color: stateMedval},
            text:stateFullname
          };
          
          
          var data = [ trace1];
          
          var layout = {
            xaxis: {
              title:{text:"Ocuppied Rate"}
            },
            yaxis: {
              title:{text:"Median House Value"}
            },
            title:`${yearSelected} US Housing Occupancy Rate vs Median House Values`
          };
          
        Plotly.newPlot('scaplot', data, layout);
          
    };

    //display defualt plots as ID=940
    function init(){
        //initial geomap
        plotGeomap(tableData,2019)
        plotScatter(tableData,2019)
     };

    init();

    //call the function when a change takes place
    selectTag.on("change",updatePlotly);

    function updatePlotly(){
        //grab selected value
        var selectedValue=selectTag.property("value");
        console.log(selectedValue);

        //update geomap
        plotGeomap(tableData,selectedValue);
        plotScatter(tableData,selectedValue);
    };
    
});

