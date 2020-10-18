const url="/api/v1.0/table";

d3.json(url).then(function(data){
    var tableData=data;
    //console.log(tableData);

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
                fontColor: 'sandybrown',
                fontStyle:'bold',
                padding:15,
                text: `${year} ${state} House Mediumn Values`
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