/* ==== TOP RIGHT UI ELEMENT ==== */

var amenity_legend = L.control({position: 'topright'});

amenity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');

    title = '<h4 id="time_header">Sea Level Rise USA ' + 
            `<a id="help-link" title="Help!" href="#" onclick="showHelpPopup('main');return false;"><div class="bubble"><img src="lib/QMark-Blue.svg"/></div></a>` + 
            '</h4>';


    location_drop = '<td><h3 style="text-align:left;font-size:16px;">Sea Level Rise:</h3></td><td><h3 style="text-align: right;font-size:16px;margin-right:5px;"><span id="sliText">+2ft</span></h3></td></tr><tr>' + 
                  '<td colspan="2"><input style="width: 20rem;" type="range" id="sliSlider" name="vol" min="1" max="10" value="2"></td>';
    


    demographic_drop = '<td style="min-width: 100px;"><h3 style="display:inline">Population:</h3></td>' + 
                    '<td style="min-width: 150px;"><div class="location_drop_div" style="float: right"><select class="location_drop" id="popDropDown">';
    demographic_drop += '<option value="exposed">Exposed</option>';
    demographic_drop += '<option value="isolated" selected>Isolated</option>';
    demographic_drop += '</select></div></td>';
    
    state_drop = '<td><h3 style="display:inline">State:</h3></td>' + 
                    '<td><div class="location_drop_div" style="float: right"><select class="location_drop" id="stateDropDown">';
    state_drop += '<option value="All" selected>All</option>';
    for (state in state_centers) {
        if (state != 'All') state_drop += '<option value="' + state + '">' + state + '</option>';
    }
    state_drop += '</select></div></td>';

    var capita_switch = `<td><h3 style="display:inline">Per Capita:</h3></td>
    <td style="text-align:right"><label class="switch">
        <input id="capitaSwitch" type="checkbox">
        <span class="slider round"></span>
    </label></td>`;

    div.innerHTML = title + '<table style="width:100%;border-spacing: 0 8px;"><tr>' + location_drop + '</tr><tr>' + demographic_drop + '</tr><tr>' + state_drop + '</tr><tr>' + capita_switch + '</tr></table>';
    
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
    updateFilteredCounties(stateMenu.value);
    updateMap();
}


/* Updates the map on changing the state
*/
var capitaMenu = document.getElementById("capitaSwitch");
capitaMenu.onchange = function() {
    console.log(capitaMenu.checked);
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
    (capitaMenu.checked ? cmap_percs : (stateMenu.value == 'All' ? cmap : cmap_tracts)).forEach( function(v) {
      labels.push('<tr>' + 
          '<td class="legend cblock" id="leg' + v.idx + '" style="color:' + v.text + '; background:' + v.fill + '"></td>' +
          '<td class="ltext">' + v.label + '</td></tr>');
    });
    labels.reverse();

    table = '<table id="legend_table">' + labels.join('') + '</table>';
    
    var title = popMenu.value;
    title = title[0].toUpperCase() + title.slice(1).toLowerCase();
    var bracket = `(${(capitaMenu.checked ? 'Per Capita' : (stateMenu.value == 'All' ? 'Counties' : 'Tracts'))})`;
    div.innerHTML = `<h3 style="font-size:0.9rem;margin:0.2rem;">${title} Population ${bracket}:</h3>` + table;
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
        $('#help-popup p').html(` We argue that current assessments on risk of displacement from SLR that calculate the at risk population as those directly exposed to the water do not capture the entire impact and are therefore underestimating the risk. To begin to evaluate the full population at risk of displacement we use a measure of access to common amenities and services.<br><br>
        Access is a common metric in the urban planning and equity literature because of its ability to capture how the spatial properties of infrastructure (e.g., road design, density of development) impact people as opposed to engineering metrics which focus more on the intrinsic properties of infrastructure (e.g., topology or reliability metrics). More recently, research has suggested access as a measure for resilience because of its ability to capture the availability of opportunities which enhance qualities such as social cohesion, economic stimulus, and even recovery capacity. Access in the context of SLR provides a complementary metric to risk of displacement for measuring burden. From the most basic level, diminished accessibility is indicative of time costs stemming from longer commute times and potentially greater greenhouse gas emissions from combustion engines. A lack of accessibility altogether to key public accommodations signals opportunity loss.`);
    
    } else if (help_type == 'graph') {
        if (current_graph == 'delayed_onset') { 
            $('#help-popup h2').html(`Delayed Onset Help Title`);  
            $('#help-popup p').html(`Delayed Onset Help Text`);    

        } else if (current_graph == 'affected_population') {
            $('#help-popup h2').html(`Affected Population Help Title`);  
            $('#help-popup p').html(`Affected Population Help Text`);    

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