var map = L.map('map').setView([32, -84], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/warnekeb/clswrfll8002e01py3vvoerv4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2FybmVrZWIiLCJhIjoiY2xzb3plZzh4MDAwdzJqczNjYnJxY3Y3dyJ9.KAtMBP36gpid7pf25U1BXQ', {
    maxZoom: 19
}).addTo(map);

const geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var markers = new L.MarkerClusterGroup();

var selector = L.control({
    position: 'topright'
  });
  
  selector.onAdd = function() {
    var div = L.DomUtil.create('div', 'mySelector');
    div.innerHTML = '<select id = "marker_select"><option value = "init"></option></select>';
    return div;
  };
  
  selector.addTo(map);

fetch('data/Recreation_Opportunities.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, geojsonMarkerOptions).bindPopup('Name: ' + feature.properties.RECAREANAME + '</b><br />' +
                    'Activity: ' + feature.properties.MARKERACTIVITY + '</b><br />' +
                    'Link: <a href="' + feature.properties.RECAREAURL + '" target="_blank">Visit</a>');
            }
        }).addTo(markers);
        map.addLayer(markers);

        // Populate the dropdown with unique activity types
        var select = document.getElementById('category-select');
        var activities = data.features.map(feature => feature.properties.MARKERACTIVITY);
        var uniqueActivities = [...new Set(activities)];
        uniqueActivities.forEach(activity => {
            var option = document.createElement('option');
            option.text = activity;
            option.value = activity;
            select.add(option);
        });
    });

// Event listener for when dropdown selection changes
document.getElementById('category-select').addEventListener('change', function () {
    var selectedActivity = this.value;
    markers.eachLayer(function (layer) {
        if (layer.feature.properties.MARKERACTIVITY === selectedActivity || selectedActivity === 'All') {
            layer.addTo(map);
        } else {
            map.removeLayer(layer);
        }
    });
});
