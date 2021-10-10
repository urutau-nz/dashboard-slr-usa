# An Interactive Web-App for the WREMO Project's Data
Displays the predicted availability of various amenities post-distaster, throughout the Wellington area.

Files described in order of import.

<br/>

## /js/colors.js
Defines the colors for the legend, as well as functions for fetching them.
#### +getColorIndex(d)
> Given a decimal distance, returns the index of the relevant color.
#### +getColor(d)
> Given a decimal distance, returns the relevant color.

<br/>

## /js/bounds.js
Defines ```city_bounds```, a dict of regions and their coordinates.

<br/>

## /js/load_data.js
Loads and prepares data.
Defines:
 - ```distances``` - a list of distances from blocks to amenities according to time frames after a major event.
 - ```blocks``` - a list of renderable blocks, according to a topojson format.
 - ```filtered_distances``` - A version of ```distances```, filtered by the user-defined amenity and timeframe.
#### +updateFilteredDistances(amenity, time)
> Filters ```distances``` by the specified amenity and time, and sets ```filtered_distances``` to the result.

<br/>

## /js/map.js
Generates and handles the Leaflet Map & Tile Layer.
Defines:
 - ```map``` - Leaflet map object.
#### +updateBlocks()
> Updates the styles of all blocks on the map.
#### -highlightFeature(e)
> Function used by Leaflet API on block mouseover. Highlights the block, and updates the distance pop-up.
#### -resetHighlight(e)
> Function used by Leaflet API on block mouseout. Removes Highlight, and hides the distance pop-up.
#### -onEachFeature(feature, layer)
> Function used by Leaflet API to link above events to each block.
#### -style(feature)
> Function used by Leaflet API to style each individual block.

<br/>

## /js/interface.js
Creates the Leaflet control panels. 
Defines:
 - ```amenity_legend``` - Leaflet control for top-right panel.
 - ```time_legend``` - Leaflet control for top-left panel.
 - ```scale_legend``` - Leaflet control for bottom-left panel.
 - ```info_legend``` - Leaflet control for distance popup that follows the mouse.
___
 - ```amenityMenu``` - DOM Object for the amenity dropdown menu.
 - ```timeValue``` - Integer of currently selected time value, automatically updated.
#### -showHelpPopup()
> Displays the help pop-up.
#### -hideHelpPopup()
> Hides the help pop-up.

<br/>

## /js/intro.js
Defines options for the IntroJS introduction to the webapp.
