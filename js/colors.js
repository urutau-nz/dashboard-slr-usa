

var cmap_population = [{"idx" : 0, "label" : "100,000+", "lower" : 100000, "upper" : 200000, "text" : "black", "fill" : '#440154'},
            {"idx" : 1, "label" : "< 100,000", "lower" : 50000, "upper" : 100000, "text" : "black", "fill" : '#404387'},
            {"idx" : 2, "label" : "< 50,000", "lower" : 25000, "upper" : 50000, "text" : "black", "fill" : '#29788E'},
            {"idx" : 3, "label" : "< 25,000", "lower" : 10000, "upper" : 25000, "text" : "black", "fill" : '#22A784'},
            {"idx" : 4, "label" : "< 10,000", "lower" : 1, "upper" : 10000, "text" : "black", "fill" : '#79D151'},
            {"idx" : 5, "label" : "0", "lower" : 0, "upper" : 1, "text" : "black", "fill" : '#c5e3b8'}];

var cmap_distance = [{"idx" : 0, "label" : "8+ km", "default": 8, "lower" : 8, "upper" : 2000, "text" : "white", "fill" : '#000'},
            {"idx" : 1, "label" : "8 km", "default": 4, "lower" : 4, "upper" : 8, "text" : "black", "fill" : '#440154'},
            {"idx" : 2, "label" : "4 km", "default": 2, "lower" : 2, "upper" : 4, "text" : "black", "fill" : '#404387'},
            {"idx" : 3, "label" : "2 km", "default": 0.8, "lower" : 0.8, "upper" : 2, "text" : "black", "fill" : '#29788E'},
            {"idx" : 4, "label" : "800 m", "default": 0.4, "lower" : 0.4, "upper" : 0.8, "text" : "black", "fill" : '#22A784'},
            {"idx" : 5, "label" : "400 m", "default": 0, "lower" : 0, "upper" : 0.4, "text" : "black", "fill" : '#79D151'}];

var cmap = cmap_population;

var cmap_tracts = [{"idx" : 0, "label" : "1000+", "lower" : 1000, "upper" : 2000, "text" : "black", "fill" : '#440154'},
            {"idx" : 1, "label" : "< 1000", "lower" : 500, "upper" : 1000, "text" : "black", "fill" : '#404387'},
            {"idx" : 2, "label" : "< 500", "lower" : 250, "upper" : 500, "text" : "black", "fill" : '#29788E'},
            {"idx" : 3, "label" : "< 250", "lower" : 100, "upper" : 250, "text" : "black", "fill" : '#22A784'},
            {"idx" : 4, "label" : "< 100", "lower" : 1, "upper" : 100, "text" : "black", "fill" : '#79D151'},
            {"idx" : 5, "label" : "0", "lower" : 0, "upper" : 1, "text" : "black", "fill" : '#c5e3b8'}];

var cmap_percs = [{"idx" : 0, "label" : "50% +", "lower" : 50, "upper" : 101, "text" : "black", "fill" : '#440154'},
            {"idx" : 1, "label" : "< 50%", "lower" : 20, "upper" : 50, "text" : "black", "fill" : '#404387'},
            {"idx" : 2, "label" : "< 20%", "lower" : 10, "upper" : 20, "text" : "black", "fill" : '#29788E'},
            {"idx" : 3, "label" : "< 10%", "lower" : 5, "upper" : 10, "text" : "black", "fill" : '#22A784'},
            {"idx" : 4, "label" : "< 5%", "lower" : 0.01, "upper" : 5, "text" : "black", "fill" : '#79D151'},
            {"idx" : 5, "label" : "0", "lower" : 0, "upper" : 0.01, "text" : "black", "fill" : '#c5e3b8'}];



var cdest = {'1': "#40F", '2': "#FCF000", '3': "#FF5050"}

/* Returns the index of a distance's legend color.
Params:
  d - a decimal distance

Returns:
  Integer - index of color in cmap.
*/
function getColorIndex(d) {
  for (var vi in cmap) {
    if (d >= cmap[vi].lower) return vi;
  }
}
    

/* Returns a distance's legend color.
Params:
  d - a decimal distance

Returns:
  String - hex color
*/
function getColor(d) {
  for (var vi in cmap) {
    if (d >= cmap[vi].lower) 
      return cmap[vi].fill;
  }

  return '#000';
}
    

function getTractColor(d) {
  for (var vi in cmap_tracts) {
    if (d >= cmap_tracts[vi].lower) 
      return cmap_tracts[vi].fill;
  }

  return '#000';
}


function getPercColor(d) {
  for (var vi in cmap_percs) {
    if (d >= cmap_percs[vi].lower) 
      return cmap_percs[vi].fill;
  }

  return '#000';
}

