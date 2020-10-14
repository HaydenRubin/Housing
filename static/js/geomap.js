//map 
const url="/api/v1.0/table";
//alert("WELCOME TO OUR PROJECT")

d3.json(url).then(function(data){

    //create an array of object with 2019 data
    var filteredData=data.filter(row => row.year===2019);
    //console.log(filteredData);

    //create arrays of values to put into the data variable below
    var stateCodes=filteredData.map(row=>row.code);
    var stateNames=filteredData.map(row=>row.state);
    var stateRates=filteredData.map(row=>row.occupied_perc);
   
     var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: stateCodes,
        z: stateRates,
        text: stateNames,
        zmin: 73, //Math.min(unpack(filteredData, 'occupied_perc')),
        zmax: 100,
        colorscale: 'Hot',
        colorbar: {
            title: 'Percentage',
            width: 10
        },
        marker: { //outline of states
            line:{
            color: 'rgb(255,255,255)',
            width: 2
            }
        }
    }];
        
        
    var layout = {
        title: '2019 US Housing Occupied Percentage by State',
        geo:{
            scope: 'usa',
            showlakes: true,
            lakecolor: 'rgb(255,255,255)'
        }
    };
        
    Plotly.newPlot("geoMap", data, layout, {showLink: false});  
});

