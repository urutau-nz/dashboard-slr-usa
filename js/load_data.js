

/* ==== MODULAR IMPORTS (EXPERIMENTAL!) ==== */

/** CSVImport()
 * Asynchronously imports a csv at a given address, and passes the return value into a custom,
 * specified function.
 * 
 * @param {String} url - Url to import from.
 * @param {function} data_conversion - For converting the csv object into the desired raw object.
 * @param {'o'/'d'/'od'} return_type - Returns either the raw [o]bject, a custom-keyed [d]ict, or both.
 * @param {function(return_value)} success_action - A function to be run after collecting the object.
 *                                                  Takes the return value as a parameter.
 * @param {function(item)?} keygen - Optional param for generating a custom-keyed dict.
 *                                   Takes an item of the object as a parameter.
 *//*
function CSVImport(url, data_conversion, return_type, success_action, keygen=null) {
  var complete_action = function (error, json) {
    if(error)
    {
      return console.error(error);
    }
    var object = json;

    var dict;
    if (['d','od'].includes(return_type.toLowerCase()) && keygen != null) {
      // Generate custom-keyed dict
      dict = Object.assign({}, ...object.map((d) => ({[keygen(d)]: d})));
    } else {
      dict = null;
    }

    var output;
    switch (return_type.toLowerCase()) {
      case 'o': output = object; break;
      case 'd': output = dict; break;
      case 'od': output = (object, dict); break;
    }

    if (DEBUGGING) {
        console.log("Item Imported");
        console.log(output);
    };
    
    success_action(output);
  }
  d3.csv(url, data_conversion, complete_action);
}




/** waitOnImports()
 * Waits synchronously on a set of CSV (!) imports to complete, then returns.
 * 
 * @param {List} import_list - A list of sets of parameters to pass into CSVImport.
 *//*
function waitOnImports(import_list, success_action) {
  var imports_remaining = import_list.length;
  var wait_func = async () => {
    if(imports_remaining > 0) {
      window.setTimeout(wait_func, 100); 
    } else {
      success_action();
    }
  }

  for (param_set of import_list) {
    console.log(param_set);
    var new_success_action = function (output) {
      param_set[3](output);
      imports_remaining--;
      console.log("REMAINING:", imports_remaining);
    }
    CSVImport(param_set[0], param_set[1], param_set[2], new_success_action, 
              (param_set.length >= 5 ? param_set[4] : null));
  }

  wait_func();
}







var initial_imports = [];

var distances = [];
let distances_import = ['https://raw.githubusercontent.com/urutau-nz/dash-access-resilience/main/data/distances.csv',
  ({city,hazard,id_orig,distance,dest_type,dist_type,isolated}) => ({city: city,hazard: hazard,id_orig: id_orig,distance:+distance/1000,dest_type: dest_type,dist_type: dist_type,isolated: isolated}),
  'o',
  (object) => {
    console.log(object);
    distances = object;
  }
];
console.log(distances_import);
initial_imports.push(distances_import);

var cities = [];
let cities_import = ['https://raw.githubusercontent.com/urutau-nz/dash-access-resilience/main/data/map_locs.csv',
  d3.autoType,
  'd',
  (dict) => {
    cities = dict;
    console.log("cities!!!!");
  },
  (d => d.city)
];
initial_imports.push(cities_import);

var all_hazard_info = [];
let hazard_info_import = ['https://raw.githubusercontent.com/urutau-nz/dash-access-resilience/main/data/hazard_info.csv',
  d3.autoType,
  'o',
  (object) => {
    all_hazard_info = object;
  }
];
initial_imports.push(hazard_info_import);

var all_hazards = [];
let hazards_import = ['https://raw.githubusercontent.com/urutau-nz/dash-access-resilience/main/data/hazards.csv',
  ({city, hazard1, hazard2, hazard3, hazard4}) => ({city: city, hazard1:hazard1, hazard2:hazard2,hazard3:hazard3,hazard4:hazard4}),
  'o',
  (object) => {
    all_hazards = object;
  }
];
initial_imports.push(hazards_import);

var road_lengths = [];
let road_lengths_import = ['https://raw.githubusercontent.com/urutau-nz/dash-access-resilience/main/data/road_lengths.csv',
  ({city, hazard, name, total, full}) => ({city: city, hazard: hazard, name: name, total: +total, full: +full}),
  'o',
  (object) => {
    road_lengths = object;
  }
];
initial_imports.push(road_lengths_import);


var INIT_IMPORTS = false;
waitOnImports(initial_imports, initMap);



var destinations = [];






  
/* ==== LOAD DISTANCES DATA ==== */

var isolated_pops = [];
var isolated_pops_loaded = false;

var exposed_pops = [];
var exposed_pops_loaded = false;

var blocks = [];
var blocks_loaded = false;

function checkLoaded() {
  return isolated_pops_loaded && exposed_pops_loaded && blocks_loaded;
}

var url = 'https://raw.githubusercontent.com/urutau-nz/dashboard-slr-usa/master/data/results/isolation_county.csv';
d3.csv(url, (d) => ({geoid: d.geoid_county, year: +d.year, rise: +d.rise, pop: +d.count}), function(error, json) 
  {
    if(error)
    {
      return console.error(error);
    }
    isolated_pops = json;
    isolated_pops_loaded = true;

    if (DEBUGGING) {
        console.log("Isolated Pops Imported");
        console.log(isolated_pops);
    };
    
    if (checkLoaded()) {
      initMap();
    }
  });
  
var url = 'https://raw.githubusercontent.com/urutau-nz/dashboard-slr-usa/master/data/results/exposure_county.csv';
d3.csv(url, (d) => ({geoid: d.geoid_county, year: +d.year, rise: +d.rise, state: d.state, pop: +d.U7B001}), function(error, json) 
  {
    if(error)
    {
      return console.error(error);
    }
    exposed_pops = json;
    exposed_pops_loaded = true;

    if (DEBUGGING) {
        console.log("Exposed Pops Imported");
        console.log(exposed_pops);
    };
    
    if (checkLoaded()) {
      initMap();
    }
  });
  


/* ==== LOAD BLOCKS DATA ==== */

var url = 'https://projects.urbanintelligence.co.nz/slr-usa/data/results/county.json'; 
d3.json(url, function(error, json) 
  {
    if(error)
    {
      return console.error(error);
    }
    blocks = json;
    blocks_loaded = true;

    // This removes the duplicate geometry ids, by finding the point at which it starts looping,
    // and cutting the geometries off there.
    var prev = [];
    var filtered_geometries = [];
    for (geometry_id in blocks.objects.data.geometries){
        prop_id = blocks.objects.data.geometries[geometry_id].properties.id;
        if (!prev.includes(prop_id)) {
            prev.push(prop_id);
            filtered_geometries.push(blocks.objects.data.geometries[geometry_id]);
        }
    }
    blocks.objects.data.geometries = filtered_geometries;

    if (DEBUGGING) {
        console.log("Blocks Imported");
        console.log(blocks);
    };
    
    if (checkLoaded()) {
      initMap();
    }
  });








  

/* Updates filtered_distances to distances filtered by the user's current selections.
Params:
  amenity - String code for an amenity.
  time - String of integer 0-6, representing time passed after the disaster.
*/
var filtered_distances = [];
var distances_by_geoid = {};
function updateFilteredDistances(sli, year, pop) {
    if (pop == "isolated") {
      filtered_distances = isolated_pops.filter(d => d.year == year || !d.year);
    } else {
      filtered_distances = exposed_pops.filter(d => d.year == year || !d.year);
    }
    distances_by_geoid = Object.assign({}, ...filtered_distances.filter(d => d.rise == sli).map((d) => ({[d.geoid]: d.pop})));

    if (DEBUGGING) {
        console.log("Updated Filtered Distances");
        console.log(">> " + sli);
        console.log(">> " + year);
        console.log(filtered_distances);
        console.log(distances_by_geoid);
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
    updateMap();
  }
}



/* Updates entire map */
function updateMap(sli="2", year="2020", pop="isolated") {
  // Update Data
  updateFilteredDistances(sli, year, pop);

  // Update Graphics
  updateBlocks();
  updateGraph();
  
  setScaleLegend();
}