

/* MODULAR IMPORTS */

var import_manager = new ImportManager();

import_manager.addImport('isolation_county', 'Isolated County Pops', 'csv', 
    'https://projects.urbanintelligence.co.nz/slr-usa/data/results/isolation_county.csv',
    (d) => ({type: 'county', geoid: d.geoid_county, rise: +d.rise, state: d.state_name, state_code: d.state_code, pop: +d.U7B001, perc: +d.U7B001_percentage}));

import_manager.addImport('exposure_county', 'Exposed County Pops', 'csv', 
'https://projects.urbanintelligence.co.nz/slr-usa/data/results/exposure_county.csv',
(d) => ({type: 'county', geoid: d.geoid_county, rise: +d.rise, state: d.state_name, state_code: d.state_code, pop: +d.U7B001, perc: +d.U7B001_percentage}));

import_manager.addImport('isolation_tract', 'Isolated Tract Pops', 'csv', 
'https://projects.urbanintelligence.co.nz/slr-usa/data/results/isolation_tract.csv',
(d) => ({type: 'tract', geoid: d.geoid_tract, rise: +d.rise, state: d.state_name, state_code: d.state_code, pop: +d.U7B001, perc: +d.U7B001_percentage}));

import_manager.addImport('exposure_tract', 'Exposed Tract Pops', 'csv', 
'https://projects.urbanintelligence.co.nz/slr-usa/data/results/exposure_tract.csv',
(d) => ({type: 'tract', geoid: d.geoid_tract, rise: +d.rise, state: d.state_name, state_code: d.state_code, pop: +d.U7B001, perc: +d.U7B001_percentage}));

import_manager.addImport('tracts', 'Tract JSON', 'json', 
'https://projects.urbanintelligence.co.nz/slr-usa/data/results/tract.json');

import_manager.addImport('counties', 'County JSON', 'json', 
'https://projects.urbanintelligence.co.nz/slr-usa/data/results/county.json');

import_manager.addImport('states', 'States JSON', 'json', 
'https://projects.urbanintelligence.co.nz/slr-usa/data/results/states.json');


import_manager.addImport('exposure_state', 'Exposure State Pops', 'csv', 
'https://projects.urbanintelligence.co.nz/slr-usa/data/results/exposure_state.csv');

import_manager.addImport('isolation_state', 'Isolation State Pops', 'csv', 
'https://projects.urbanintelligence.co.nz/slr-usa/data/results/isolation_state.csv');


import_manager.addImport('delayed_onset_histogram_data', 'Delayed Onset Histogram', 'csv', 
'https://projects.urbanintelligence.co.nz/slr-usa/data/results/delayed_onset_histogram_data.csv');



import_manager.onProgress(importsProgress);
import_manager.onComplete(importsComplete);
import_manager.runImports();


var isolated_pops = [];
var isolated_tract_pops = [];
var isolated_state_pops = [];
var exposed_pops = [];
var exposed_tract_pops = [];
var exposed_state_pops = [];
var counties = [];
var tracts = [];
var states = [];

var all_county_geometries = [];
var all_tract_geometries = [];

var delayed_onset_histogram_data = [];
var state_codes = {'All': 'all'};


function importsComplete(imports) {
  isolated_pops = imports['isolation_county'].filter(d => d.rise > 0);
  exposed_pops = imports['exposure_county'].filter(d => d.rise > 0);
  isolated_tract_pops = imports['isolation_tract'].filter(d => d.rise > 0);
  exposed_tract_pops = imports['exposure_tract'].filter(d => d.rise > 0);
  isolated_state_pops = imports['isolation_state'].filter(d => d.rise > 0);
  exposed_state_pops = imports['exposure_state'].filter(d => d.rise > 0);

  counties = imports['counties'];
  tracts = imports['tracts'];
  states = imports['states'];
  all_county_geometries = all_county_geometries.concat(counties.objects.county.geometries);
  all_tract_geometries = all_tract_geometries.concat(tracts.objects.tract.geometries);

  delayed_onset_histogram_data = imports['delayed_onset_histogram_data'];

  // Generate State Code dict from isolated
  isolated_state_pops.forEach(d => {
    if (!Object.keys(state_codes).includes(d.state_name)) {
      state_codes[d.state_name] = d.state_code;
    }
  });

  
  $('.introjs-donebutton').addClass("active");
  $('.introjs-donebutton').text("Let's go!");
  initMap();
}

function importsProgress(completed, total) {
}
  







var state_centers = {
  "Alabama": {
    "center": {
        "lat": 31.69779270531287,
        "lng": -86.8853759765625
    },
    "zoom": 8
},
  "California": {
    "center": {
        "lat": 36.4433803110554,
        "lng": -118.74023437500001
    },
    "zoom": 7
},
  "Connecticut": {
    "center": {
        "lat": 41.53839396783225,
        "lng": -72.71850585937501
    },
    "zoom": 9
},
  "Delaware": {
    "center": {
        "lat": 39.128994951066765,
        "lng": -75.24261474609376
    },
    "zoom": 9
},
  "District of Columbia": {
    "center": {
        "lat": 38.89236892551996,
        "lng": -77.03338623046876
    },
    "zoom": 11
},
  "Florida": {
    "center": {
        "lat": 28.570049879647403,
        "lng": -82.57324218750001
    },
    "zoom": 7
},
  "Georgia": {
    "center": {
        "lat": 32.084901663548315,
        "lng": -82.12829589843751
    },
    "zoom": 8
},
  "Hawaii": {
    "center": {
        "lat": 20.702169504822308,
        "lng": -156.76116943359375
    },
    "zoom": 8
},
  "Louisiana": {
    "center": {
        "lat": 30.346805868962075,
        "lng": -91.47216796875001
    },
    "zoom": 8
},
  "Maine": {
    "center": {
        "lat": 45.35600542155823,
        "lng": -69.00512695312501
    },
    "zoom": 7
},
  "Maryland": {
    "center": {
        "lat": 39.05118518880596,
        "lng": -76.915283203125
    },
    "zoom": 8
},
  "Massachusetts": {
    "center": {
        "lat": 42.05031239367961,
        "lng": -71.18316650390626
    },
    "zoom": 9
},
  "Mississippi": {
    "center": {
        "lat": 31.529385064020936,
        "lng": -89.384765625
    },
    "zoom": 8
},
  "New Hampshire": {
    "center": {
        "lat": 43.47484730064834,
        "lng": -71.52099609375001
    },
    "zoom": 8
},
  "New Jersey": {
    "center": {
        "lat": 40.176774799905445,
        "lng": -74.69604492187501
    },
    "zoom": 8
},
  "New York": {
    "center": {
        "lat": 41.53531012183376,
        "lng": -73.70727539062501
    },
    "zoom": 8
},
  "North Carolina": {
    "center": {
        "lat": 35.29719384502174,
        "lng": -77.47009277343751
    },
    "zoom": 8
},
  "Oregon": {
    "center": {
        "lat": 44.09942068528654,
        "lng": -120.73974609375001
    },
    "zoom": 7
},
  "Pennsylvania": {
    "center": {
        "lat": 40.591013883455936,
        "lng": -76.54174804687501
    },
    "zoom": 8
},
  "Rhode Island": {
    "center": {
        "lat": 41.671373126259354,
        "lng": -71.44958496093751
    },
    "zoom": 10
},
  "South Carolina": {
    "center": {
        "lat": 33.47956309444182,
        "lng": -80.06835937500001
    },
    "zoom": 8
},
  "Texas": {
    "center": {
        "lat": 28.82061274169944,
        "lng": -95.284423828125
    },
    "zoom": 7
},
  "Virginia": {
    "center": {
        "lat": 37.74682893940135,
        "lng": -76.88781738281251
    },
    "zoom": 8
},
  "Washington": {
    "center": {
        "lat": 47.327653995607115,
        "lng": -121.39892578125001
    },
    "zoom": 7
},
  "All": {
    "center": {
        "lat": 39.38526381099774,
        "lng": -97.03125000000001
    },
    "zoom": 5
  }
};




/* Updates filtered_distances to distances filtered by the user's current selections.
Params:
  amenity - String code for an amenity.
  time - String of integer 0-6, representing time passed after the disaster.
*/
var filtered_distances = [];
var distances_by_geoid = {};
function updateFilteredDistances(sli, pop) {
    let year = '2020';
    let dfilter = function (d) {
      return (stateMenu.value == 'All' || d.state == stateMenu.value);
    }
    if (pop == "isolated") {
      filtered_distances = isolated_pops.filter(dfilter);
      filtered_distances = filtered_distances.concat(isolated_tract_pops.filter(dfilter));
    } else {
      filtered_distances = exposed_pops.filter(dfilter);
      filtered_distances = filtered_distances.concat(exposed_tract_pops.filter(dfilter));
    }
    distances_by_geoid = Object.assign({}, ...filtered_distances.filter(d => d.rise == sli).map((d) => ({[d.geoid]: d})));

    if (DEBUGGING) {
        console.log("Updated Filtered Distances");
        console.log(">> " + sli);
        console.log(">> " + year);
        console.log(filtered_distances);
        console.log(distances_by_geoid);
    };
}

var filtered_counties;
var filtered_tracts;
function updateFilteredCounties(state) {
    if (state != 'All') {
      filtered_counties = {};

      filtered_tracts = {};
      var geometries = all_tract_geometries.filter(d => d.properties.state_name == state);
      Object.assign(filtered_tracts, tracts);
      filtered_tracts.objects.tract.geometries = geometries;

    } else {
      filtered_tracts = {};
      filtered_counties = {};
      Object.assign(filtered_counties, counties);
      filtered_counties.objects.county.geometries = all_county_geometries;
    }

    if (DEBUGGING) {
        console.log("Updated Filtered Counties & Tracts");
        console.log(">> " + state);
        console.log(filtered_counties);
        console.log(filtered_tracts);
    };
}





/* First update to map */
function initMap() {
  if (!LOADED) {
      var wait_to_load = setInterval(function() {
          if (LOADED) {
              clearInterval(wait_to_load); 
              initMap();
          }
      }, 100);
  } else {
    updateFilteredCounties(stateMenu.value);
    updateMap();
  }
}



/* Updates entire map */
function updateMap(sli, pop) {
  if (!sli) {
    sli = sliMenu.value;
  }
  if (!pop) {
    pop = popMenu.value;
  }

  // Update Data
  updateFilteredDistances(sli, pop);

  // Update Graphics
  updateCounties();
  updateGraph();
  
  setScaleLegend();
}