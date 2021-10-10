

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

var distances = [];
var distances_loaded = false;

var blocks = [];
var blocks_loaded = false;

function checkLoaded() {
  return distances_loaded && blocks_loaded;
}

var url = 'https://raw.githubusercontent.com/urutau-nz/dashboard-slr-usa/master/data/results/isolation20_county.csv'; 
d3.csv(url, ({geoid, dest_type, distance, time}) => ({geoid: geoid, dest_type: dest_type, distance: +distance/1000, time:+time}), function(error, json) 
  {
    if(error)
    {
      return console.error(error);
    }
    distances = json;
    distances_loaded = true;

    if (DEBUGGING) {
        console.log("Distances Imported");
        console.log(distances);
    };
    
    if (checkLoaded()) {
        updateMap();
    }
  });


/* ==== LOAD BLOCKS DATA ==== */

var url = 'https://raw.githubusercontent.com/urutau-nz/dashboard-slr-usa/master/data/results/county.json'; 
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
        updateMap();
    }
  });







/* Experimental City Simplification Algorithm */

function convArci(num) {
  if (num < 0) {
    return ~num;
  } else {
    return num;
  }
}

function simplifyTopology(topo, city) {

  var block_list = [];
  var city = cities[city];

  // Sort by first arc index
  for (i in topo.objects.block.geometries) {
    let poly = topo.objects.block.geometries[i];
    if (poly.type == "Polygon") {
      block_list.push(poly);
    }
  } 

  block_list.sort(function (a, b) { return convArci(a.arcs[0][0]) - convArci(b.arcs[0][0]) });

  console.log(block_list);

  var new_geometries = [];

  for (block_i in block_list) {
    block = block_list[block_i];
    //if (block_i > 10) break;

    if (block_i < block_list.length-1) {
      var next = block_list[parseInt(block_i) + 1].arcs[0];

      var arc_matches = [];

      for (arc_i in block.arcs[0]) {
        arc = block.arcs[0][arc_i];
        
        for (arc2_i in next) {
          arc2 = next[arc2_i];

          if (convArci(arc2) == convArci(arc)) { 
            arc_matches.push(convArci(arc));
          }
        }
      }

      if (arc_matches.length == 0) {
        new_geometries.push(block);
      } else {


        var new_arcs = [];
        
        var last = block.arcs[0];

        console.log(arc_matches);
        console.log(last, next);

        for (arc of arc_matches) {
          console.log(topo.arcs[convArci(arc)]);
        }
        
        console.log(arc_matches);
        console.log(last, next);
        
        if (arc_matches.length == 1) {
          while (convArci(next[0]) != arc_matches[0]) next.push(next.shift());
          while (convArci(last[0]) != arc_matches[0]) last.push(last.shift());
          new_arcs.push(...last.slice(1));
          new_arcs.push(...next.slice(1));
        } else {
          // Find smallest span that covers all matches
          var min_i = 0;
          var max_i = 2000;
          var max = 0;
          var min = 0;
          for (i=0; i < last.length-1; i++) {
            last.push(last.shift());
            let my_min_i = last.findIndex(x => arc_matches.includes(x));
            let my_max_i = last.length - 1 - last.slice().reverse().findIndex(x => arc_matches.includes(x));
            if (my_max_i - my_min_i < max_i - min_i) {
              max_i = my_max_i;
              min_i = my_min_i;
              max = convArci(last[my_max_i]);
              min = convArci(last[my_min_i]);
              console.log(last, max_i, max, min_i, min);
            }
          }

          // Remove portion between the two arcs in each
          while (convArci(next[0]) != max) next.push(next.shift());
          while (convArci(last[0]) != min) last.push(last.shift());
          console.log(next, last);
          while (convArci(next[0]) != min) next.shift();
          while (convArci(last[0]) != max) last.shift();
          console.log(next, last);

          // Add together like above
          new_arcs.push(...last.slice(1));
          new_arcs.push(...next.slice(1));
          console.log(next, last);
        }

        console.log(last, next, new_arcs);
        
        for (arc of new_arcs) {
          console.log(topo.arcs[convArci(arc)]);
        }


        block_list[parseInt(block_i) + 1].arcs[0] = new_arcs;

      }
    }
  }
  new_geometries.push(block);
  console.log("DIFF: ", topo.objects.block.geometries.length, new_geometries.length);
  topo.objects.block.geometries = new_geometries;
}













/* ==== LOAD DESTINATIONS DATA ==== */

var url = 'https://raw.githubusercontent.com/urutau-nz/x-minute-city/master/data/results/destinations_region.csv';
d3.csv(url, d3.autoType, function(error, json) {
  if(error)
  {
    return console.error(error);
  }
  city_destinations = json;

  if (DEBUGGING) {
      console.log("Destinations Imported");
      console.log(city_destinations);
  };
})


/* ==== LOAD HISTROGRAM DATA ==== */

var histogram_data = [];
var temp_all_regions = [];
var url = "https://raw.githubusercontent.com/urutau-nz/x-minute-city/master/data/results/access_histogram.csv";
d3.csv(url, d3.autoType, function(error, json) {
    if(error)
    {
      return console.error(error);
    }
    histogram_data = json;
  
    if (DEBUGGING) {
        console.log("Histogram Data Imported");
        console.log(histogram_data);
    };

    updateFilteredHistogramData("supermarket", "Auckland", "walking");
}) 




  

/* Updates filtered_distances to distances filtered by the user's current selections.
Params:
  amenity - String code for an amenity.
  time - String of integer 0-6, representing time passed after the disaster.
*/
var filtered_distances = [];
var distances_by_geoid = {};
function updateFilteredDistances(sli, year, pop) {
    filtered_distances = distances.filter(d => d.rise == sli);
    distances_by_geoid = Object.assign({}, ...filtered_distances.map((d) => ({[d.geoid]: d.distance})));

    if (DEBUGGING) {
        console.log("Updated Filtered Distances");
        console.log(">> " + sli);
        console.log(">> " + year);
        console.log(filtered_distances);
        console.log(distances_by_geoid);
    };
}




var filtered_histogram_data = [];
function updateFilteredHistogramData(sli, year, pop) {
    filtered_histogram_data = histogram_data.filter(d => true); // Add Demographics && Region
    
    if (DEBUGGING) {
        console.log("Updated Filtered Histrogram Data");
        console.log(">> " + sli);
        console.log(">> " + year);
        console.log(">> " + pop);
        console.log(filtered_histogram_data);
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
    updateMap("supermarket", "walking");
  }
}



/* Updates entire map */
function updateMap(sli, year, pop) {
  console.log(map.getCenter());

  // Update Data
  updateFilteredDistances(sli, year, pop);
  updateFilteredHistogramData(sli, year, pop);

  // Update Graphics
  updateBlocks();
  updateMarkers(); 
  updateGraph();
  
  setScaleLegend();
  setAvailabilityLegend();
}