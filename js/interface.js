/* ==== TOP RIGHT UI ELEMENT ==== */

var amenity_legend = L.control({position: 'topright'});

amenity_legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');

    title = '<h4 id="time_header">Sea Level Rise USA ' + 
            '<a id="helpLink" title="Help!" href="#" onclick="showHelpPopup();return false;"><img class="qimg" src="qmark.svg"></a>' + 
            '</h4>';


    location_drop = '<h3>Sea Level Increase:</h3>' + 
                  '<input style="width: 100%;" type="range" id="sliSlider" name="vol" min="1" max="10" value="2">';
    
    amenity_drop = '<td><h3 style="display:inline">Year:</h3></td>' + 
                    '<td><div class="location_drop_div" style="float: right"><select class="location_drop" id="yearDropDown">' +
                    '<option value="2020" selected>2020</option>' +
                    '<option value="2010" disabled>2010</option>' +
                    '</select></div></td>';


    demographic_drop = '<td style="min-width: 100px;"><h3 style="display:inline">Population:</h3></td>' + 
                    '<td style="min-width: 150px;"><div class="location_drop_div" style="float: right"><select class="location_drop" id="popDropDown">';
    demographic_drop += '<option value="exposed" selected>Exposed</option>';
    demographic_drop += '<option value="isolated" selected>Isolated</option>';
    demographic_drop += '</select></div></td>';

    div.innerHTML = title + '<hr>'  + location_drop + '<hr><table style="width:100%;"><tr>' + demographic_drop + '</tr><tr>' + 
                     amenity_drop + '</tr></table>';
    
    return div;
};

amenity_legend.addTo(map);


/* Updates the map on changing amenity selection.
*/
var sliMenu = document.getElementById("sliSlider");
sliMenu.onchange = function() {
    updateMap(sliMenu.value, yearMenu.value);
}

/* Relocates map to focus on region selected, when region is selected. 
*/
var popMenu = document.getElementById("popDropDown");
popMenu.onchange = function() {
    updateMap(sliMenu.value, yearMenu.value);
}

/* Updates the map on changing the mode
*/
var yearMenu = document.getElementById("yearDropDown");
yearMenu.onchange = function() {
    updateMap(sliMenu.value, yearMenu.value);
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
    cmap.forEach( function(v) {
      labels.push('<tr>' + 
          '<td class="legend cblock" id="leg' + v.idx + '" style="color:' + v.text + '; background:' + v.fill + '"></td>' +
          '<td class="ltext">' + v.label + '</td></tr>');
    });
    labels.reverse();

    table = '<table id="legend_table">' + labels.join('') + '</table>';
    
    var title = popMenu.value;
    title = title[0].toUpperCase() + title.slice(1).toLowerCase();
    div.innerHTML = '<h3 style="font-size:0.9rem;margin:0.2rem;">' + title + ' Population:</h3>' + table;
}










/* Lower-Right Graph
*/
let graph_legend = L.control({ position: 'bottomright' });
graph_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "dist-graph";

    return div;
};
graph_legend.addTo(map);







// Gives Info on Q-mark click
function showHelpPopup(){
    var popup = document.getElementById("help-popup");
    popup.style.display = "block";

    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "hidden";
}
function hideHelpPopup() {
    var popup = document.getElementById("help-popup");
    popup.style.display = "none";
}




// Region Info Follows Mouse (Also known as the distance pop-up)
let info_legend = L.control({position: 'topleft'});
info_legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.id = "mouseInfo";
    div.style.position = "absolute";
    div.style.whiteSpace = "nowrap";
    div.style.fontSize = "15px";
    div.style.visibility = "hidden";
    div.innerHTML = 'Distance: 0km';
    
    return div;
};
info_legend.addTo(map);

document.addEventListener('mousemove', function(e) {
    var info_legend = document.getElementById("mouseInfo");
    let left = e.pageX;
    let top = e.pageY;
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