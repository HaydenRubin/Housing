//map 
const url="/api/v1.0/table";
//alert("WELCOME TO OUR PROJECT")

//return an array of objects with only the selected year
//console.log(yearSelected);

d3.json(url).then(function(data){
    
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
    
    function plotGeomap(yearSelected) {


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
                width: 4
            },
            marker: { //outline of states
                line:{
                color: 'rgb(255,255,255)',
                width: 2
                }
            }
        }];
        
        var layout = {
            title: `${yearSelected} US Housing Occupied Percentage by State`,
            geo:{
                scope: 'usa',
                showlakes: true,
                lakecolor: 'rgb(255,255,255)'
            }
        };
        
        Plotly.newPlot("geoMap", traceData, layout, {showLink: false});  
    };

     //display defualt plots as ID=940
     function init(){
        //initial geomap
        plotGeomap(2019)
     };

    init();

    //call the function when a change takes place
    selectTag.on("change",updatePlotly);

    function updatePlotly(){
        //grab selected value
        var selectedValue=selectTag.property("value");
        console.log(selectedValue);

        //update geomap
        plotGeomap(selectedValue);
    };
    
});

