


/* ==== INITIALISE LEAFLET MAP & TILE LAYER ==== */

var map = L.map('map', {"attributionControl": false, center: [39.487084981687495, -95.77880859375001], zoom: 5, minZoom : 4, zoomControl: false, worldCopyJump: true, crs: L.CRS.EPSG3857});
//attr = L.control.attribution().addAttribution('<a href="https://urbanintelligence.co.nz/">Urban Intelligence</a>');
//attr.addTo(map);

var tile_layer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
                             {"attributionControl": false, "detectRetina": false, "maxZoom": 16, "minZoom": 4,
                              "noWrap": false, "subdomains": "abc"}).addTo(map);

map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}{r}.png',
            {pane: 'labels'}).addTo(map);



/* ==== BLOCK MOUSE EVENTS ==== */

/* Highlights a block on mouseover, and updates the distance pop-up.
Params:
    e - event object passed by browser.
*/
function highlightFeature(e) {
    var layer = e.target;
    let distance = distances_by_geoid[layer.feature.properties.id];
    if (typeof distances_by_geoid[layer.feature.properties.id] != "undefined") {
        layer.setStyle({
        weight: 3,
        opacity: 1,
        fillOpacity: 0.75
        });
        
        var title = popMenu.value;
        title = title[0].toUpperCase() + title.slice(1).toLowerCase();

        // Update Mouse Info
        var mouse_info = document.getElementById("mouseInfo");
        mouse_info.style.visibility = "visible";
        mouse_info.innerHTML = title + " Population: "; //+ layer.feature.properties.id + " ";
        mouse_info.innerHTML += Math.floor(distance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
/* Resets a block's highlight on mouseout, and hides the distance pop-up
Params:
    e - event object passed by browser.
*/
function resetHighlight(e) {
    var layer = e.target;
    
    layer.setStyle({
      weight: 1,
      opacity: 0.2,
      fillOpacity: 0.5
    });
    
    // Update Mouse Info
    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "hidden";
}
/* Links the above two functions to the mouseover & mouseout events. Called by Leaflet API.
Params:
    feature, layer - objects passed by Leaflet API.
*/
function onEachFeature(feature, layer) { 
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}




/* Styles individual blocks. Called by Leaflet API.
Params:
    feature - Leaflet feature object for an individual block.
*/
function style(feature) {
    let col;
    if (filtered_distances.length == 0) { 
        col="#000000";
    } else if (typeof distances_by_geoid[feature.properties.id] != "undefined") {
        col = getColor(distances_by_geoid[feature.properties.id]);
    } else {
        col = "#FFF"
    }
    return { fillColor: col, weight: 1, color: col, opacity: 0.2, fillOpacity: 0.5};
}


/* Updates all blocks on the map
*/
var geojsonCountyLayer = null;
var geojsonTractLayer = null;
function updateCounties() {
    if (geojsonCountyLayer) {
        // Already exists, must be removed
        map.removeLayer(geojsonCountyLayer);
    }
    if (geojsonTractLayer) {
        // Already exists, must be removed
        map.removeLayer(geojsonTractLayer);
    }
    geojsonCountyLayer = L.geoJSON(topojson.feature(filtered_counties, filtered_counties.objects.county), 
    {style : style, onEachFeature : onEachFeature}
    ).addTo(map);
    if (stateMenu.value != 'All') {
        geojsonTractLayer = L.geoJSON(topojson.feature(filtered_tracts, filtered_tracts.objects.tract), 
        {style : style, onEachFeature : onEachFeature}
        ).addTo(map);
    }
}





