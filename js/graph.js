function updateGraph() {
    // set the dimensions and margins of the graph
    
    var margin = {top: 30, right: 20, bottom: 60, left: 85},
        width = 460 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    /*
    document.getElementById("dist-graph").innerHTML = '<table id="graph-toggle"><tr>' + 
                    '<td class="' + (current_graph == 0 ? 'active' : '') + ' opt1" onclick="graph_toggle(0)">Population Distribution</td>' + 
                    '<td class="' + (current_graph == 1 ? 'active' : '') + ' opt2" onclick="graph_toggle(1)">Amenity Availability</td></tr></table>';
    */

    document.getElementById("dist-graph").innerHTML = '';

    /*
    if (current_graph == 0) {
        // append the svg object to the body of the page
        var svg = d3.select("#dist-graph")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        
        // Build Graph Data
        var graph_data = [];
        var graph_labels = [];
        for (item of cmap) {
            graph_labels.push(item.label);
        }
        graph_labels.reverse();
        graph_labels.forEach(x => graph_data.push({label: x, value: 0}));

        filtered_histogram_data.forEach(x => {
            var bin;
            bin = cmap.length - 1 - getColorIndex(x.distance);
            graph_data[bin].value += x.pop_perc;
            graph_data[bin].color = cmap[cmap.length - 1 - bin].fill;
        });


        // X axis
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(graph_labels)
        .padding(0.2);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        
        // X axis label


        svg.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
                            (height + margin.top + 15) + ")")
        .style("text-anchor", "middle")
        .text("Increase in Sea Level")
        .attr('class','graph-axis-label');




        
        var max_height = 0;
        graph_data.forEach(x => {
            if (x.value > max_height) {
                max_height = x.value;
            }
        });

        var round_amount = 50;
        for (amount of [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000]) {
            if (max_height / 6 > amount) {
                round_amount = amount;
            }
        }

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, Math.ceil(max_height/round_amount)*round_amount])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));


        // Add Y axis label

        var title = popMenu.value;
        title = title[0].toUpperCase() + title.slice(1).toLowerCase();

        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(title + " Population")
        .attr('class','graph-axis-label');   


        // Bars
        svg.selectAll("mybar")
        .data(graph_data)
        .enter()
        .append("rect")
            .attr("x", function(d) { return x(d.label); })
            .attr("y", function(d) { return y(d.value); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.value); })
            .attr("fill", function(d) { return d.color; })
        
        
        
        
    } */

    
    // append the svg object to the body of the page
    var svg = d3.select("#dist-graph")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        
    
    // Build Graph Data
    var graph_data = [];

    filtered_distances.forEach(x => {
        graph_data.push([x.rise, x.pop]);
    });
        
    // X axis label


    svg.append("text")
    .attr("transform",
        "translate(" + (width/2) + " ," +
                        (height + margin.top + 15) + ")")
    .style("text-anchor", "middle")
    .text("Increase in Sea Level (ft)")
    .attr('class','graph-axis-label');


    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 10])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        
    
    var max_height = 0;
    graph_data.forEach(x => {
        if (x[1] > max_height) {
            max_height = x[1];
        }
    });

    var round_amount = 50;
    for (amount of [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000]) {
        if (max_height / 6 > amount) {
            round_amount = amount;
        }
    }


        // Add Y axis label

    var title = popMenu.value;
    title = title[0].toUpperCase() + title.slice(1).toLowerCase();

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(title + " Population")
        .attr('class','graph-axis-label');   


    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, Math.ceil(max_height/round_amount)*round_amount])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(graph_data)
        .enter()
        .append("circle")
            .attr("cx", function (d) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 3)
            .style("fill", "#69b3a2")
        
    // Expand/Contract Button
    var button = '<div id="graph_expansion_button" onclick="graph_expand()">⤡</div>';
    document.getElementById("dist-graph").innerHTML += button; 

}

var graph_expanded = true;
function graph_expand() {
    var graph = document.getElementById("dist-graph");

    graph_expanded = !graph_expanded;
    if (graph_expanded) {
        graph.style.height = "";
        graph.style.width = "";
        graph.style.paddingTop = "";
    } else {
        graph.style.height = "30px";
        graph.style.width = "30px";
        graph.style.paddingTop = "6px";
    }
}

var current_graph = 0;
function graph_toggle(num) {
    if (num != current_graph) {
        current_graph = num;
        updateGraph();
    }
}