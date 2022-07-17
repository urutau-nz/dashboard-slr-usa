/* ==== TOP RIGHT UI ELEMENT ==== */

var amenity_legend = L.control({position: 'topright'});

amenity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');

    title = '<h4 id="time_header">Sea Level Rise USA ' + 
            `<a id="help-link" title="Help!" href="#" onclick="showHelpPopup('main');return false;"><div class="bubble"><img src="lib/QMark-Blue.svg"/></div></a>` + 
            '</h4>';


    location_drop = '<td><h3 style="text-align:left;font-size:16px;">Sea Level Rise:</h3></td><td><h3 style="text-align: right;font-size:16px;margin-right:5px;"><span id="sliText">+2ft</span></h3></td></tr><tr>' + 
                  '<td colspan="2"><input style="width: 20rem;" type="range" id="sliSlider" name="vol" min="1" max="10" value="2"></td>';
    


    demographic_drop = '<td style="min-width: 100px;"><h3 style="display:inline">Risk of:</h3></td>' + 
                    '<td style="min-width: 150px;"><div class="location_drop_div" style="float: right"><select class="location_drop" id="popDropDown">';
    demographic_drop += '<option value="exposed">Inundation</option>';
    demographic_drop += '<option value="isolated" selected>Isolation</option>';
    demographic_drop += '</select></div></td>';
    
    state_drop = '<td><h3 style="display:inline">State:</h3></td>' + 
                    '<td><div class="location_drop_div" style="float: right"><select class="location_drop" id="stateDropDown">';
    state_drop += '<option value="All" selected>All</option>';
    for (state in state_centers) {
        if (state != 'All') state_drop += '<option value="' + state + '">' + state + '</option>';
    }
    state_drop += '</select></div></td>';

    var capita_switch = `<td><h3 style="display:inline">Per Capita:</h3></td>
    <td style="text-align:right"><label class="switch" id="capitaSwitchParent">
        <input id="capitaSwitch" type="checkbox">
        <span class="slider round"></span>
    </label></td>`;
    var ratio_switch = `<td><h3 style="display:inline">Ratio:</h3></td>
    <td style="text-align:right"><label class="switch">
        <input id="ratioSwitch" type="checkbox">
        <span class="slider round"></span>
    </label></td>`;

    div.innerHTML = title + '<table style="width:100%;border-spacing: 0 8px;"><tr class="location-drop">' + location_drop + 
    '</tr><tr class="demographic-drop">' + demographic_drop + '</tr><tr class="state-drop">' + state_drop + 
    '</tr><tr class="capita-switch">' + capita_switch + '</tr><tr class="ratio-switch">' + ratio_switch + '</tr></table>';
    
    return div;
};

amenity_legend.addTo(map);


/* Updates the map on changing amenity selection.
*/
var sliMenu = document.getElementById("sliSlider");
sliMenu.oninput = function() {
    var sliText = document.getElementById("sliText");
    sliText.innerText = "+" + sliMenu.value + "ft";
    updateMap();
}

/* Relocates map to focus on region selected, when region is selected. 
*/
var popMenu = document.getElementById("popDropDown");
popMenu.onchange = function() {
    updateMap();
}


/* Updates the map on changing the state
*/
var stateMenu = document.getElementById("stateDropDown");
stateMenu.onchange = function() {
    var newView = state_centers[stateMenu.value];
    map.setView(newView.center, newView.zoom);

    // Hide ratio if not all
    if (stateMenu.value == 'All') {
        $('tr.ratio-switch').removeClass('ratio-disabled');
    } else {
        $('tr.ratio-switch').addClass('ratio-disabled');
    }

    updateFilteredCounties(stateMenu.value);
    updateMap();
}


/* Updates the map on changing the state
*/
var capitaMenu = document.getElementById("capitaSwitch");
capitaMenu.onchange = function() {
    updateMap();
}


/* Updates the map on changing the state
*/
var ratioMenu = document.getElementById("ratioSwitch");
ratioMenu.onchange = function() {
    if (ratioMenu.checked) {
        // Hide other form items
        $('tr.demographic-drop').addClass('ratio-disabled');
        $('tr.state-drop').addClass('ratio-disabled');
        $('tr.capita-switch').addClass('ratio-disabled');
    } else {
        // Reveal other form items
        $('tr.demographic-drop').removeClass('ratio-disabled');
        $('tr.state-drop').removeClass('ratio-disabled');
        $('tr.capita-switch').removeClass('ratio-disabled');
    }
    updateMap();
}










/* ==== BOTTOM LEFT UI ELEMENTS ==== */

let scale_legend = L.control({ position: 'bottomleft' });
scale_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "scale_legend";
    
    setScaleLegend(div);
    
    return div;
};
scale_legend.addTo(map);

/* Generates the contents of the Scale Legend in the bottom right.
*/
function setScaleLegend(div = null) {
    if (!div) div = document.getElementById("scale_legend");

    var labels = [];

    var selected_cmap = [];
    if (ratioMenu.checked) {
        selected_cmap = cmap_ratios;
    } else if (capitaMenu.checked) {
        selected_cmap = cmap_percs;
    } else if (stateMenu.value == 'All') {
        selected_cmap = cmap;
    } else {
        selected_cmap = cmap_tracts;
    }
    selected_cmap.forEach( function(v) {
      labels.push('<tr>' + 
          '<td class="legend cblock" id="leg' + v.idx + '" style="color:' + v.text + '; background:' + v.fill + '"></td>' +
          '<td class="ltext">' + v.label + '</td></tr>');
    });
    labels.reverse();

    table = '<table id="legend_table">' + labels.join('') + '</table>';
    
    if (ratioMenu.checked) {
        var title = "Isolation:Inundation";
    } else {
        var title = popMenu.value;
        title = title[0].toUpperCase() + title.slice(1).toLowerCase();
        if (title == 'Exposed') title = 'Inundated';
        var bracket = `(${(capitaMenu.checked ? 'Per Capita' : (stateMenu.value == 'All' ? 'Counties' : 'Tracts'))})`;
        title = `${title} Population ${bracket}:`;
    }
    title = `<h3 style="font-size:0.9rem;margin:0.2rem;">${title}</h3>`;

    div.innerHTML = title + table;
}

/* FOR MANUALLY SETTING STATE ZOOMS & CENTERS */ 
document.getElementById('scale_legend').onclick = function () {
    console.log({'center': map.getCenter(), 'zoom': map.getZoom()});
}










/* Lower-Right Graph
*/
let graph_legend = L.control({ position: 'bottomright' });
graph_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "dist-graph";

    div.innerHTML = `<table id="graph-loading-logos-table">
    <tr><td>
    <img src="lib/round_logo.svg"\>
    </td></tr>
    </table>
    `;
    
    
    
    
    
    return div;
};
graph_legend.addTo(map);







// Gives Info on Q-mark click
function showHelpPopup(help_type){
    var popup = document.getElementById("help-popup");
    popup.style.display = "block";

    $('#help-backdrop').css('display', 'block');

    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "hidden";

    if (help_type == 'main') {
        $('#help-popup h2').html(`Direct and indirect impacts of sea-level rise on USA communities`);  
        $('#help-popup p').html(`This comparison shows that risk of inundation may be considerably underestimating the burden of sea-level rise and when this burden may commence. Additionally, we see that these effects are notably different in some regions than others.<br><br>
        We analyse the risk of isolation, defined as where residents are unable to access a primary school, fire station, and emergency medical service due to road inundation. These destinations represent key activity areas to which residents need reliable access. Additionally, this measure acts as a proxy for the number of people at risk of unreliable services (electricity, water etc.) given how these horizontal assets are collocated with our roads (that is, if a road is inundated, the other infrastructure is at risk of damage).`);
    
    } else if (help_type == 'graph') {
        if (current_graph == 'delayed_onset') { 
            $('#help-popup h2').html(`Delayed Onset Histogram`);  
            $('#help-popup p').html(`Isolation is often, but not always, a forewarning of inundation. This figure shows how much earlier residents might be isolated before they are inundated - in some cases people are isolated, and therefore burdened, decades earlier than inundation-based estimates expect. The figure also shows how many residents are isolated and not inundated within the sea-level rise (0.3-3m) scenarios.<br><br>
            The three climate scenarios (intermediate, high, extreme) are used to estimate the year that the rise will occur and are based on the scenarios used in <a href="https://toolkit.climate.gov/topics/coastal/sea-level-rise" target="_blank">the USA's Fourth National Risk Assessment</a>.`);    

        } else if (current_graph == 'affected_population') {
            $('#help-popup h2').html(`Affected Population By Sea Level Rise`);  
            $('#help-popup p').html(`This figure shows the difference between the number of people at risk from isolation vs inundation for the entire US or by State. It shows that the number is significantly higher if we consider risk of isolation.`);    

        }

    }
}
function hideHelpPopup() {
    var popup = document.getElementById("help-popup");
    popup.style.display = "none";

    $('#help-backdrop').css('display', 'none');
}




// Region Info Follows Mouse (Also known as the distance pop-up)
let info_legend = L.control({position: 'topleft'});
info_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "mouseInfo";
    div.style.position = "absolute";
    div.style.zIndex = "200000";
    div.style.whiteSpace = "nowrap";
    div.style.fontSize = "15px";
    div.style.visibility = "hidden";
    div.style.paddingRight = "8px";
    div.innerHTML = 'Distance: 0km';
    
    return div;
};
info_legend.addTo(map);

document.addEventListener('mousemove', function(e) {
    var info_legend = document.getElementById("mouseInfo");
    let left = e.pageX + 10;
    let top = e.pageY + 10;
    if (left + info_legend.offsetWidth * 1.3 >= screen.width) {
        left = screen.width - info_legend.width * 1.3;
    }
    info_legend.style.left = left + 'px';
    info_legend.style.top = top + 'px';
});





// Disable Map Dragging while cursor on controls
for (element of document.getElementsByClassName("legend")) {
    element.addEventListener('mouseover', function () {
        map.dragging.disable();
        map.doubleClickZoom.disable();
        map.boxZoom.disable();
     });
    element.addEventListener('mouseout', function () {
        map.dragging.enable();
        map.doubleClickZoom.enable();
        map.boxZoom.enable();
     });
}