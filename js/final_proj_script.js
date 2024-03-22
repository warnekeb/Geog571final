// river data from here: https://catalog.data.gov/dataset/national-wild-and-scenic-river-active-study-rivers-lines-feature-layer-3d86c
// recreation opportunities from here: https://catalog.data.gov/dataset/recreation-opportunities-feature-layer-69fe2

// get some info on the structure of the file
fetch('data/Recreation_Opportunities.geojson')
    .then(response => response.json())
    .then(data => {
        // Initialize summary object
        const summary = {
            totalFeatures: data.features.length,
            properties: {}
        };

        // Iterate through each feature
        data.features.forEach(feature => {
            // Extract properties of each feature
            const properties = feature.properties;

            // Iterate through each property
            for (const [key, value] of Object.entries(properties)) {
                // Initialize property in summary object if not already present
                if (!summary.properties[key]) {
                    summary.properties[key] = {
                        count: 1,
                        values: [value]
                    };
                } else {
                    // Update count and values array for the property
                    summary.properties[key].count++;
                    summary.properties[key].values.push(value);
                }
            }
        });

        // Print summary to console
        console.log('Summary:', summary);
    })
    .catch(error => console.error('Error fetching or parsing GeoJSON:', error));


    var map = L.map('map').setView([32, -84], 4);
// helpful locate control info: https://www.jsdelivr.com/package/npm/leaflet.locatecontrol
// potential info for filter by location: https://handsondataviz.org/leaflet-searchable-map.html

//   L.control.locate().addTo(map);
// map.locate({setView: true, maxZoom: 16});
// function onLocationFound(e) {
//     var radius = e.accuracy;

//     L.marker(e.latlng).addTo(map)
//         .bindPopup("You are within " + radius + " meters from this point").openPopup();

//     L.circle(e.latlng, radius).addTo(map);
// }
// function onLocationError(e) {
//     alert(e.message);
// }

// map.on('locationerror', onLocationError);
// map.on('locationfound', onLocationFound);
// make the map
// this is the mapping object in memory

// hyperlinks from mapbox for style
// style url: mapbox://styles/warnekeb/clswrfll8002e01py3vvoerv4
// access token: pk.eyJ1Ijoid2FybmVrZWIiLCJhIjoiY2xzb3plZzh4MDAwdzJqczNjYnJxY3Y3dyJ9.KAtMBP36gpid7pf25U1BXQ
// template: https://api.mapbox.com/styles/v1/YOUR_USERNAME/YOUR_STYLE_ID/tiles/256/{z}/{x}/{y}?access_token=YOUR_MAPBOX_ACCESS_TOKEN

L.tileLayer('https://api.mapbox.com/styles/v1/warnekeb/clswrfll8002e01py3vvoerv4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2FybmVrZWIiLCJhIjoiY2xzb3plZzh4MDAwdzJqczNjYnJxY3Y3dyJ9.KAtMBP36gpid7pf25U1BXQ', {
maxZoom: 19
}).addTo(map);

// there are 30 colors in this list
// var activity_colors = (['#543005','#8c510a','#bf812d','#dfc27d','#f6e8c3','#c7eae5','#80cdc1','#35978f','#01665e','#003c30',
// '#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#d1e5f0','#92c5de','#4393c3','#2166ac','#053061',
// '#40004b','#762a83','#9970ab','#c2a5cf','#e7d4e8','#d9f0d3','#a6dba0','#5aae61','#1b7837','#00441b'])
// // type out the different recreatioin types here
// var categoryColors = {
//     "A": colors[0],
//     "B": colors[1],
//     "C": colors[2]
//     // Add more mappings as needed
//   };
  // L.geoJSON(geojsonData, {
  //   pointToLayer: function (feature, latlng) {
  //     var category = feature.properties.category;
  //     var color = categoryColors[category];
  //     return L.circleMarker(latlng, {
  //       radius: 8,
  //       fillColor: color,
  //       color: "#000",
  //       weight: 1,
  //       opacity: 1,
  //       fillOpacity: 0.8
  //     });
  //   }
  // }).addTo(map);
  
const geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// leads for selecting activities 
// fiddle that seems promising: https://jsfiddle.net/anton9ov/atd1pr23/
// overflow post based on fiddle: https://stackoverflow.com/questions/36133080/leaflet-how-to-select-the-markers-from-drop-down-menu-on-different-layers-with


// var legend = L.control({position: 'topright'});
// legend.onAdd = function (map) {
//     var div = L.DomUtil.create('div', 'infolegend');
//     div.innerHTML = '<select><option>features.properties.MARKERACTIVITY</option></select>';
//     div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
//     return div;
// };
// legend.addTo(map);



// function pointsList (for( var i=0; i<props.length; list[i++] ) {
//   var list = []; 
//   list.push("value");
//   })

// console.log(list)

var group;
var x;


var markers = new L.MarkerClusterGroup();
fetch('data/Recreation_Opportunities.geojson')
    .then(response => response.json())
    .then(data => {
        x = L.geoJSON( data, {
          pointToLayer: function (feature, latlng) {
                return markers.addLayer(L.marker(latlng, geojsonMarkerOptions).bindPopup('Name: ' + feature.properties.RECAREANAME + '</b><br />' +
                  'Activity: ' + feature.properties.MARKERACTIVITY+ '</b><br />' +
                  'Link: <a href="' + feature.properties.RECAREAURL + '" target="_blank">Visit</a>'))
                //   document.getElementById('category-select').addEventListener('change', function() {
                //     var selectedCategory = this.value;
                //     (function(data) {
                //       if (data.feature.properties.MARKERACTIVITY === selectedCategory) {
                //         data.addTo(map);
                //       } else {
                //         map.removeLayer(data);
                //       }
                //     });
                // });            

            }}
            ).addTo(map);
 });
  
 // selection attempt
//  var selector = L.control({
//     position: 'topright'
//   });
  
//   selector.onAdd = function(map) {
//     var div = L.DomUtil.create('div', 'mySelector');
//     div.innerHTML = '<select id = "marker_select"><option value = "init"></option></select>';
//     return div;
//   };
  
//   selector.addTo(map);
  
//   map.eachLayer(function(layer) {
//     var optionElement = document.createElement("option");
//     optionElement.innerHTML = layer.feature.properties.name;
//     optionElement.value = layer._leaflet_id;
//     L.DomUtil.get("marker_select").appendChild(optionElement);
//   });
  
//   var marker_select = L.DomUtil.get("marker_select");
  
//   L.DomEvent.addListener(marker_select, 'click', function(e) {
//     L.DomEvent.stopPropagation(e);
//   });
//   L.DomEvent.addListener(marker_select, 'change', changeHandler);
  
//   function changeHandler(e) {
//     if (e.target.value == "init") {
//       map.closePopup();
//     } else {
//       var selected = map.getLayer(e.target.value);
//       markers.zoomToShowLayer(selected, function() {
//         selected.openPopup();
//       })
//     }
//   }
  
//   markers.addLayer(map);
  
//   map.addLayer(markers);
  



// geoapify stuff (isochrones)
const myAPIKey = 'd966a706d7ee454da5735f65126204fb';
let myGeoJSONLayer;
var requestOptions = {
    method: 'GET',
  };
// locate control stuff
    var startMarker = L.layerGroup();
var lc = L.control.locate({
    layer: startMarker
    
  })
  .addTo(map);

var coordsList = [];
// Event listener for when location is found
map.on('locationfound', function (e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // Add the latitude and longitude values to the list
    coordsList.push({ lat: lat, lng: lng });

    // Log the coordinates to console (optional)
    console.log("Latitude:", lat, "Longitude:", lng);

    // function to zoom to isochrone
    function zoomToiso(e) {
        map.fitBounds(e.target.getBounds());
    }

    fetch(`https://api.geoapify.com/v1/isoline?lat=${lat}&lon=${lng}&type=time&mode=drive&range=3600&apiKey=d966a706d7ee454da5735f65126204fb`, requestOptions)
        .then(data => data.json()).then(geoJSONFeatures => {
        myGeoJSONLayer = L.geoJSON(geoJSONFeatures, {
          style: (feature) => {
            return {
              stroke: true,
              color: '#9933ff',
              weight: 2,
              opacity: 0.7,
              fill: true,
              fillColor: '#7300e6',
              fillOpacity: 0.15,
              smoothFactor: 0.5,
              interactive: false
            };
           }
        });
    
        myGeoJSONLayer.addTo(map);
        map.fitBounds(myGeoJSONLayer.getBounds());
    });
});
// Event listener for when the location is lost
map.on('locationerror', function (e) {
    // Handle location error
    console.log(e.message);
});

//  var locationLayers = startMarker.getLayers();

// if (locationLayers.length === 0) {
//   alert(`startpoint not defined`);
// } else {
//   // Last position should be represented by one of the last layers
//   // (there may be several layers on same position, should you
//   // have enabled circle and/or compass)
//   var positionMarker = locationLayers[locationLayers.length - 1];
//   var lat = positionMarker.getLatLng().lat; 
//     var lng = positionMarker.getLatLng().lng;
  
//   // Do something with positionMarker.getLatLng()...
// }






// failed filter attempt
// from here: https://www.reddit.com/r/learnjavascript/comments/lzyte5/leaflet_dropdown/
// also based on this: https://codepen.io/joaquim93/pen/BaQOgwy
// function filterActivity(feature) {

//     var activityTypefilter = [];
    
//     activityTypefilter.push($("#select-1").val());
          
//     var att = feature.properties.MARKERACTIVITY;
    
//     cond1 = activityTypefilter.indexOf(att.MARKERACTIVITY) >= 0;
          
//     console.log(cond1);
    
//     return cond1;
    
//     }
    
//     $("#btn-filter").click(function () {
    
//     activityLayer.clearLayers();
    
//     activityLayer.addData(data);
    
//     });
