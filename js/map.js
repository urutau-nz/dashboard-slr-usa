


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
    let data = distances_by_geoid[layer.feature.properties.id];
    let data_exists = typeof data != "undefined";

    console.log(data, layer.feature.properties.id, data_exists);
    
    var props = layer.feature.properties;

    if (!data_exists && props.state_name != stateMenu.value && stateMenu.value != 'All') {
        // If the shape is missing bc we're zoomed into a state and it's not in it, don't show it.
        return 0;
    }

    var distance = (data_exists ? (capitaMenu.checked ? data.perc : data.pop) : 0);
    var header = '';
    if ((data_exists ? data.type == 'tract' : typeof props.name == "undefined")) {
        layer.setStyle({
        fillOpacity: 1
        });

    } else if ((data_exists ? data.type == 'county' : typeof props.name != "undefined")) {
        layer.setStyle({
        weight: 3,
        opacity: 1,
        fillOpacity: 0.75
        });


        header = "<div style='font-weight: 600; font-style: italic; margin-bottom: 3px;'>" + props.name + ", " + props.state_code + "</div>";

    }
    
    var title = popMenu.value;
    title = title[0].toUpperCase() + title.slice(1).toLowerCase();
    if (title == 'Exposed') title = 'Inundated';


    // Update Mouse Info
    var mouse_info = document.getElementById("mouseInfo");
    mouse_info.style.visibility = "visible";
    if (ratioMenu.checked) {
        // Ratio
        console.log(distances_by_geoid, layer.feature.properties.id, data);
        var value = (data.ratio == 'inf' ? 'Infinite' : Math.round((+data.ratio + Number.EPSILON) * 100) / 100);
        mouse_info.innerHTML = header + title + " Ratio: "; //+ layer.feature.properties.id + " ";
        mouse_info.innerHTML += value;
    } else if (capitaMenu.checked) {
        // Per Capita
        mouse_info.innerHTML = header + title + " Percentage: "; //+ layer.feature.properties.id + " ";
        mouse_info.innerHTML += distance + '%';
    } else {
        // Not Per Capita
        mouse_info.innerHTML = header + title + " Population: "; //+ layer.feature.properties.id + " ";
        mouse_info.innerHTML += Math.floor(distance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
/* Resets a block's highlight on mouseout, and hides the distance pop-up
Params:
    e - event object passed by browser.
*/
function resetHighlight(e) {
    var layer = e.target;
    let data = distances_by_geoid[layer.feature.properties.id];
    let data_exists = typeof data != "undefined";
    
    var props = layer.feature.properties;
    
    if ((data_exists ? data.type == 'tract' : typeof props.name == "undefined")) {
        layer.setStyle({
        fillOpacity: 0.6
        });

    } else if ((data_exists ? data.type == 'county' : typeof props.name != "undefined")) {
        
        let opacity = 0.2;
        let fillOpacity = 0.5;
        if (stateMenu.value != 'All') {
            opacity *= 0.2;
            fillOpacity *= 0.2;
        }
        
        layer.setStyle({
            weight: 1,
            opacity: opacity,
            fillOpacity: fillOpacity
            });
    }
    
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
    let data = distances_by_geoid[feature.properties.id];
    if (Object.keys(distances_by_geoid).length == 0) { 
        col="#000";
    } else if (ratioMenu.checked) {
        col = getRatioColor(data.ratio);

    } else if (typeof data != "undefined") {
        if (capitaMenu.checked) {
            col = getPercColor(data.perc);
        } else {
            col = getColor(data.pop);
        }
    } else {
        col = getColor(0);
    }
    let opacity = 0.2;
    let fillOpacity = 0.5;
    if (stateMenu.value != 'All') {
        opacity *= 0.2;
        fillOpacity *= 0.2;
    }

    return { fillColor: col, weight: 1, color: col, opacity: opacity, fillOpacity: fillOpacity};
}

function tractStyle(feature) {
    let col;
    let data = distances_by_geoid[feature.properties.id];
    if (Object.keys(distances_by_geoid).length == 0) { 
        col="#000";
    } else if (typeof data != "undefined") {
        if (capitaMenu.checked) {
            col = getPercColor(data.perc);
        } else {
            col = getTractColor(data.pop);
        }
    } else {
        col = getTractColor(0);
    }
    return { fillColor: col, weight: 1, color: '#FFF0', opacity: 0, fillOpacity: 0.6};
}




/* Updates all blocks on the map
*/
var geojsonCountyLayer = null;
var geojsonTractLayer = null;
var geojsonStateLayer = null;
function updateCounties() {
    if (geojsonCountyLayer) {
        // Already exists, must be removed
        map.removeLayer(geojsonCountyLayer);
    }
    if (geojsonTractLayer) {
        // Already exists, must be removed
        map.removeLayer(geojsonTractLayer);
    }
    if (geojsonStateLayer) {
        // Already exists, must be removed
        map.removeLayer(geojsonStateLayer);
    }

    if (stateMenu.value == 'All') {
        geojsonCountyLayer = L.geoJSON(topojson.feature(filtered_counties, filtered_counties.objects.county), 
        {style : style, onEachFeature : onEachFeature, filter: function (d) {
            var props = d.properties;
            if (ratioMenu.checked) {
                // Filter out shapes with undefinied ratios
                let data = distances_by_geoid[props.id];
                return typeof data != "undefined";
            }
            return true;
        }}
        ).addTo(map);
    } else  {
        geojsonTractLayer = L.geoJSON(topojson.feature(filtered_tracts, filtered_tracts.objects.tract), 
        {style : tractStyle, onEachFeature : onEachFeature}
        ).addTo(map);

        geojsonStateLayer = L.geoJSON(states, 
        {style : { weight: 1, color: "#555", opacity: 0.3, fillOpacity: 0}, filter : function (d) { return d.properties.NAME == stateMenu.value;}}
        ).addTo(map);
        $(".leaflet-overlay-pane svg path:last-child").css('pointer-events', 'none');

        //L.geoJSON(states, 
        //    {style : { weight: 1, color: "#FFF", opacity: 1, fillOpacity: 0}, filter : function (d) { return d.properties.NAME == stateMenu.value;}}
        //    ).addTo(geojsonStateLayer);
        //$(".leaflet-overlay-pane svg path:last-child").css('pointer-events', 'none');

    }
}





