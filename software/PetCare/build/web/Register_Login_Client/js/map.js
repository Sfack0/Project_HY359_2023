var map ;
var latitude, longitude;

function getLatLon(){
    return [latitude, longitude]
}

function changeMapButton(){
    event.preventDefault(); 

    if($('#mapButton').text() === 'Show Map'){
        $('#mapButton').text('Hide Map');
        $('.map').css('height', '350px');
        $('.map').css('border', '1px solid black');

    }else{
        $('#mapButton').text('Show Map');
        $('.map').css('height', '0px');
        $('.map').css('border', 'none');
    }
}

function findLocation() {
    const addressName = $('#address').val();
    const city = $('#city').val();
    const country = $('#country').val();
    const address = addressName + ", " + city + ", " + country;

    $.ajax({
        url: "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" + address + "&acceptlanguage=en&polygon_threshold=0.0",
        type: "GET",
        headers: {
            'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com',
            'X-RapidAPI-Key': 'd8743375abmshc22ff059123b5f3p180418jsna210d02c8d78'
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if (Array.isArray(data) && data.length > 0 && data[0].display_name) {
                removeWarnings();
                $(document).ready(function () {
                        if( !data[0].display_name.includes('Heraklion'))
                            locationWarning('Service available only in Heraklion.')
                        latitude = data[0].lat;
                        longitude = data[0].lon;
                        showOnMap(); 
                });
            } else {
                locationWarning('Location not found.');;
            }
        },
        error: function (xhr, status, error) {
            console.log("Request failed with status: " + status);
        }
    });
}


function showOnMap() {
        if (map) {
            map.destroy();
        }
        
        map = new OpenLayers.Map("map");
        var mapnik = new OpenLayers.Layer.OSM();
        map.addLayer(mapnik);

        var markerLonLat = new OpenLayers.LonLat(longitude, latitude).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        var marker = new OpenLayers.Marker(markerLonLat);
        markers.addMarker(marker);

        map.setCenter(markerLonLat, 14);    
}

 
function locationWarning(msg) {  
    var warning = document.createElement("div");
    warning.className = "warnings";
    warning.textContent = msg;

    $('#city').after(warning);
  }