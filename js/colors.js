

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
    
