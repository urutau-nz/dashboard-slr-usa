
var current_graph = "affected_population"; // affected_population or delayed_onset


var graphHoverData = {};
function updateGraph() {
    // set the dimensions and margins of the graph

    $('#graph-loading-logos-table').remove();
    $('#dist-graph>div').remove();

    if (current_graph == "affected_population") {
        $('#dist-graph').removeClass('wide');
        var full_width = 500;

    } else if (current_graph == "delayed_onset") {
        $('#dist-graph').addClass('wide');
        var full_width = 800;
    }

    /*
    $("#dist-graph").append(`<div style="background-color: #04497c; position:absolute; width: 200%; height: 43px; top: 0; left: 0;"></div>`)

    var graph = new vlGraph('dist-graph', delayed_onset_histogram_data, 'x', 'y', { 
        //sum_matches: true,
        datasets_column: 'scenario', // Separate Datasets by 'scenario' column
        filter: function(x) {return state_codes[stateMenu.value] == x.state && x.x != 170} // Filter data by this state
    });
    graph.margin({top: 60, right: 20, bottom: 50, left: 95});
    graph.title('Delayed Onset Histogram');
    graph.title_adjust(20);
    graph.watermark('USA');
    graph.x_axis_label("Time Lag between Onset of Inundation and Isolation (Years)");
    graph.x_axis_adjust(5);
    graph.x_suffix(" years");
    graph.x_ticks(20);
    graph.y_axis_label("Number of People");
    graph.y_axis_adjust(20);
    graph.y_ticks(12);
    graph.min_y(0);
    graph.gridlines(false);
    graph.colors(["#1469a9", "#F6AE2D", "#e74242"]);
    graph.legend_labels(["Intermediate", "High", "Extreme"])
    graph.addInternalLegend()
    graph.barGraph();


    // Add Never Isolated
    var second_graph = new vlGraph('dist-graph', delayed_onset_histogram_data, 'x', 'y', { 
        //sum_matches: true,
        datasets_column: 'scenario', // Separate Datasets by 'scenario' column
        filter: function(x) {return state_codes[stateMenu.value] == x.state && x.x == 170} // Filter data by this state
    });
    second_graph.margin({top: 60, right: 20, bottom: 50, left: 700});
    second_graph.max_y(graph.config.max_y);
    second_graph.min_y(graph.config.min_y);
    graph.barGraph();

    */
    

    var margin = {top: 30, right: 20, bottom: 80, left: 95},
        width = full_width - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;

    var legend_height = 30;

    document.getElementById("dist-graph").innerHTML = '';

    var is_per_capita = capitaMenu.checked && stateMenu.value != 'All';
    
    // append the svg object to the body of the page
    var svg = d3.select("#dist-graph")
    .append("svg")
        .attr("width", full_width * 20)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    svg.append('rect')
        .attr("transform", "translate(-" + margin.left + ",-" + margin.top + ")")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", full_width * 20)
        .attr("height", 43)
        .style("fill", "#04497c");
    

    
    // Title
    if (current_graph == "affected_population") {
        var title = `Affected Population ${(is_per_capita ? 'Per Capita ' : '')}By Sea Level Rise`;

    } else if (current_graph == "delayed_onset") {
        var title = `Delayed Onset Histogram`;
    }
    svg.append("text")
    .attr("transform",
        `translate(${(full_width)/2 - margin.left} ,-3)`)
    .style("font", "17px 'Rubik'")
    .style("font-weight", 500)
    .style("fill", "#FFF")
    .style("text-anchor", "middle")
    .text(title)
    .attr('class','graph-title');
    


    // Faded State
    var back = (stateMenu.value == "All" ? 'USA' : stateMenu.value);
    var size = (stateMenu.value == 'District of Columbia' ? 34 : (stateMenu.value.length > 6 ? 42 : 50));
    svg.append("text")
    .attr('transform-origin', '')
    .attr("transform",
        "translate(" + (width/2) + " ," + (height/2 + legend_height + size/2 - 10) + ")")
    .style("font", size + "px 'Rubik'")
    .style("font-weight", 800)
    .style("fill", "#0001")
    .style("text-anchor", "middle")
    .text(back);

    
    
    // Build Graph Data
    var datasets = {};

    if (current_graph == "affected_population") {
        // Affected Population Graph
        datasets['exposed'] = [];
        datasets['isolated'] = [];
    
        for (var i = 0; i < 11; i++ ) {
            datasets['isolated'].push([i, 0]);
            datasets['exposed'].push([i, 0]);
        }
    
        if (stateMenu.value == 'All') {
            // For all USA
            isolated_state_pops.forEach(x => { datasets['isolated'][x.rise][1] +=  x.U7B001; });
            exposed_state_pops.forEach(x => { datasets['exposed'][x.rise][1] +=  x.U7B001; });
    
        } else {
            if (capitaMenu.checked) {
                // Per Capita
                isolated_state_pops.forEach(x => {
                    if (x.state_name == stateMenu.value)  datasets['isolated'][x.rise][1] +=  x.U7B001_percentage;
                });
                exposed_state_pops.forEach(x => {
                    if (x.state_name == stateMenu.value)  datasets['exposed'][x.rise][1] +=  x.U7B001_percentage;
                });
    
            } else {
                // Not Per Capita
                isolated_pops.forEach(x => {
                    if (x.state == stateMenu.value) datasets['isolated'][x.rise][1] +=  x.pop;
                });
                exposed_pops.forEach(x => {
                    if (x.state == stateMenu.value)  datasets['exposed'][x.rise][1] +=  x.pop;
                });
            }
        }

        // Remove 0
        datasets['exposed'].shift();
        datasets['isolated'].shift();

    } else if  (current_graph == "delayed_onset") {
        // Delayed Onset Graph
        datasets['intermediate'] = [];
        datasets['high'] = [];
        datasets['extreme'] = [];
        
        delayed_onset_histogram_data.forEach(x => {
            if (state_codes[stateMenu.value] == x.state) {
                datasets[x.scenario].push([x.x, x.y]);
            }
        });

        
        // DESIGN BAR GRAPH
        var bar_num = datasets[Object.keys(datasets)[0]].length;
        var bar_variants = Object.keys(datasets).length;
        var bar_width = width / (1.2 * bar_num * bar_variants);
        var dataset_offsets = {};
        Object.keys(datasets).forEach((d, i) => {
            dataset_offsets[d] = (i - bar_variants + 2) * bar_width;
        });
        

        // Remove 170
        var safe_bar = {};
        safe_bar['intermediate'] = datasets['intermediate'].pop();
        safe_bar['high'] = datasets['high'].pop();
        safe_bar['extreme'] = datasets['extreme'].pop();

    }


    // Determine max height & x from values
    var max_height = null;
    var max_x = null;
    var min_x = null;
    for (var label of Object.keys(datasets)) {
        var dataset = datasets[label];

        if (!max_height) max_height = dataset[0][1];
        if (!max_x) max_x = dataset[0][0];
        if (!min_x) min_x = dataset[0][0];

        dataset.forEach(x => {
            if (x[1] > max_height) {
                max_height = x[1];
            }
            if (x[0] > max_x) {
                max_x = x[0];
            }
            if (x[0] < min_x) {
                min_x = x[0];
            }
        });
    }
    if (current_graph == "delayed_onset") {
        // Give space for bars
        if (safe_bar['intermediate'][1] > max_height) max_height = safe_bar['intermediate'][1];
        if (safe_bar['high'][1] > max_height) max_height = safe_bar['high'][1];
        if (safe_bar['extreme'][1] > max_height) max_height = safe_bar['extreme'][1];

        max_x += 5;
        min_x -= 5;
        width -= 80;
    }

    var round_amount = 2;
    for (amount of [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000]) {
        if (max_height / 6 > amount) {
            round_amount = amount;
        }
    }

    
    var x = d3.scaleLinear()
        .domain([min_x, max_x])
        .range([ 0, width ]);
    var y = d3.scaleLinear()
        .domain([0, Math.ceil(max_height/round_amount + 1)*(round_amount)])
        .range([ height, 0]);

    
    // Highlight line
    svg.append('line')
    .attr("id", "graph-highlight")
    .style("stroke", "#AAA")
    .style("stroke-width", 2)
    .attr("x1", 0)
    .attr("y1", legend_height)
    .attr("x2", 0)
    .attr("y2", height + legend_height); 
    

        
    // X axis label

    if (current_graph == 'affected_population') { var x_axis_label = "Increase in Sea Level (ft)";
    } else if (current_graph == 'delayed_onset') { var x_axis_label = "Time Lag between Onset of Inundation and Isolation (Years)";
    }
    svg.append("text")
    .attr("transform",
        "translate(" + (width/2) + " ," +
                        (height + 37 + legend_height) + ")")
    .style("text-anchor", "middle")
    .text(x_axis_label)
    .attr('class','graph-axis-label');



    
    // Add X axis

    if (current_graph == 'delayed_onset') {
        var x_safe = d3.scaleLinear()
        .domain([165, 175])
        .range([ 0, bar_width * 1.2 * bar_variants]);

        // Add X axis
        svg.append("g")
        .attr("transform", "translate(0," + (height + legend_height) + ")")
        .call(d3.axisBottom(x).ticks(20));
        

        // Add safe X axis
        var chuck = svg.append("g")
        .attr("transform", "translate(" + (width + 30) + "," + (height + legend_height) + ")")
        .attr("class", "safe_scale")
        .call(d3.axisBottom(x_safe).ticks(1));

        $('.safe_scale text').text("Isolated but");

        chuck.append('text')
        .attr('transform', 'translate(16.75, 0)')
        .attr('fill', '#000')
        .attr('y', '20')
        .attr('dy', '0.71em')
        .text('Not Inundated');

    } else {

        // Add X axis
        svg.append("g")
        .attr("transform", "translate(0," + (height + legend_height) + ")")
        .call(d3.axisBottom(x));

    }
    


    // Add Y axis label


    if (current_graph == 'affected_population') { var y_axis_label = "Affected Population"  + (is_per_capita ? ' Per Capita' : '');
    } else if (current_graph == 'delayed_onset') { var y_axis_label = "Number of People";
    }
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + (stateMenu.value == 'All' ? 10 : 15))
        .attr("x",0 - (height / 2 + legend_height))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(y_axis_label)
        .attr('class','graph-axis-label');   
    


    // Add Y axis
    svg.append("g")
        .attr("transform", "translate(0," + (legend_height) + ")")
        .call(d3.axisLeft(y));





    // Legend
    if (current_graph == 'affected_population') { 
        var legend = [
            ["Isolated" + (is_per_capita ? ' %' : ''), '#1469a9'],  
            ["Inundated" + (is_per_capita ? ' %' : ''), "#F6AE2D"]
        ];
    } else if (current_graph == 'delayed_onset') { 
        var legend = [
            ["Intermediate", '#1469a9'],  
            ["High", "#F6AE2D"],
            ["Extreme", "#e74242"],
        ];
        var dataset_legend = {
            "intermediate": '#1469a9',  
            "high": "#F6AE2D",
            "extreme": "#e74242"};
    }

    

    
    for (var label of Object.keys(datasets)) {
        var dataset = datasets[label];
        
        
        if (current_graph == 'affected_population') {
            // Create the Line
            svg.append("path")
            .datum(dataset)
            .attr("transform", "translate(0," + (legend_height) + ")")
            .attr("fill", "none")
            .attr("stroke", (label == 'isolated' ? "#1469a9" : "#F6AE2D")) 
            .attr("stroke-width", (label == popMenu.value ? 3 : 2))
            .attr("opacity", (label == popMenu.value ? 1 : 0.5))
            .attr("d", d3.line()
                .x(function(d) { return x(d[0]) })
                .y(function(d) { return y(d[1]) })
                );

        } else if  (current_graph == "delayed_onset") {
            // Create the rects
            for (var pair of dataset) {
                
                svg.append('rect')
                .attr("transform", "translate(" + (dataset_offsets[label] - bar_width/2) + ",0)")
                .attr("x", x(pair[0]))
                .attr("y", (legend_height + y(pair[1])))
                .attr("width", bar_width)
                .attr("height", height - y(pair[1]))
                .attr("rx", 2)
                .attr("ry", 2)
                .style("fill", dataset_legend[label])
                .attr("stroke", "#BBB")
                .attr("stroke-width", 0);
            }


            svg.append('rect')
            .attr("transform", "translate(" + (dataset_offsets[label] - bar_width/2 + (width + 30)) + ",0)")
            .attr("x", x_safe(safe_bar[label][0]))
            .attr("y", (legend_height + y(safe_bar[label][1])))
            .attr("width", bar_width)
            .attr("height", height - y(safe_bar[label][1]))
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", dataset_legend[label])
            .attr("stroke", "#BBB")
            .attr("stroke-width", 0);

        }
          
    }


    var left = 5;
    for (var index in legend) {
        var pair = legend[index];

        svg.append('rect')
            .attr("transform", `translate(${left}, ${legend_height})`)
            .attr("x", 11)
            .attr("y", 0)
            .attr("width", 14)
            .attr("height", 14)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", pair[1])
            .attr("stroke", "#BBB")
            .attr("stroke-width", 1);
    
        svg.append("text")
            .attr("transform", `translate(${left}, ${legend_height})`)
            .attr("x", 29)
            .attr("y", 11)
            .text(pair[0])
            .style("font", "12px 'Rubik'");   
        
        left += pair[0].length * 5.5 + 36;
    }
    

    

        
    // Expand/Contract Button & Menu button & Help button
    $("#dist-graph").append('<div id="graph_expansion_button" onclick="graph_expand()">⤡</div>');
    $("#dist-graph").append(`<div id="graph_menu_button" ${graph_expanded ? `` : 'class="hide"'}  onclick="graph_menu()"><img src="./lib/hamburger-white.svg"/></div>
    <div id="graph-menu-div">
        <table>
            <tr>
                <td ${current_graph == 'affected_population' ? `class="disabled"` : ''} id="affected_population-option" onclick="set_graph('affected_population')">
                    Affected Population by SLR
                </td>
            </tr>
            <tr>
                <td ${current_graph == 'delayed_onset' ? `class="disabled"` : ''} id="delayed_onset-option" onclick="set_graph('delayed_onset')">
                    Delayed Onset Histogram
                </td>
            </tr>
        </table>
    </div>`);

    $("#dist-graph").append(`<div id="graph-help-button" onclick="showHelpPopup('graph')"><img src="lib/QMark-Blue.svg"/></div>`);

    display_graph_menu_tooltip();
}

var graph_expanded = true;
function graph_expand() {
    var graph = document.getElementById("dist-graph");

    graph_expanded = !graph_expanded;
    if (graph_expanded) {
        $('#graph_menu_button').removeClass('hide');
        graph.style.height = "";
        graph.style.width = "";
    } else {
        $('#graph_menu_button').addClass('hide');
        graph.style.height = "43px";
        graph.style.width = "43px";
    }
}



function graph_menu() {
    $(`#graph_menu_button`).toggleClass('active');
    $(`#graph-menu-div`).toggleClass('active');
    graph_menu_tooltip_visible = false;
    $(`#graph-menu-button-tooltip`).remove();
}

function set_graph(graph_type) {
    current_graph = graph_type;

    updateGraph();
}


// Tooltip
var graph_menu_tooltip_visible = true;
function display_graph_menu_tooltip() {
    if (graph_menu_tooltip_visible) {
        $(`#graph_menu_button`).append(`<div id="graph-menu-button-tooltip">Click here to switch graphs!<div class="tooltip-pointer"></div></div>`);
    }
}