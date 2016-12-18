// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

function initialize() {
  var locations = [
  ['San Diego', 32.65, -117.05, 4]];

   window.map = new google.maps.Map(document.getElementById('map'), {
     mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: {lat: 50, lng: -70},
          zoom: 12,
          styles: [
    {"featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#7f2200"},
    {"visibility": "off"}]},
    {"featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers":
    [{"visibility": "on"},
    {"color": "#87ae79"}]},
    {"featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#495421"}]},
    {"featureType": "administrative",
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#ffffff"},
    {"visibility": "on"},
    {"weight": 4.1}]},
    {"featureType": "administrative.neighborhood",
    "elementType": "labels",
    "stylers": [{"visibility": "off"}]},
    {"featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
    {"color": "#abce83"}]},
    {"featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#769E72"}]},
    {"featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#7B8758"}]},
    {"featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#EBF4A4"}]},
    {"featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{"visibility": "simplified"},
    {"color": "#8dab68"}]},{
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [{
    "visibility": "simplified"}]},
    {"featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#5B5B3F"}]},
    {"featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#ABCE83"}]},
    {"featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{"visibility": "off"}]},
    {"featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{"color": "#EBF4A4"}]},
    {"featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{"weight": "0.56"}]},
    {"featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [{"weight": "0.50"}]},
    {"featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{"color": "#d8d385"}]},
    {"featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [{"weight": "0.18"},
    {"lightness": "21"}]},
    {"featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{"color": "#A4C67D"}]},
    {"featureType": "transit",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]},
    {"featureType": "water",
    "elementType": "geometry",
    "stylers": [{"visibility": "on"},
    {"color": "#aee2e0"}]}]
    });

  var infowindow = new google.maps.InfoWindow();

  var bounds = new google.maps.LatLngBounds();

  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });

    bounds.extend(marker.position);

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }

  map.fitBounds(bounds);

  var listener = google.maps.event.addListener(map, "idle", function () {
    map.setZoom(7);
    google.maps.event.removeListener(listener);
  });
}

$(document).ready(function(){
  $.ajax({
    url: '/',
    method: "GET",
    dataType: "JSON"
    })
    .done(function(response){
      var tweetResponse = response;
      function addMarker(lat, long) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            map: map
        });
        return marker
      }


      //the tweet response is an array of arrays, each containing tweet object
      //the code below iterates through the tweet response array, and the contained sub arrays
      //for each tweet object it pulls the longitude and latitude depending on where theyre store
      //it then creates a map marker for each one
      console.log(tweetResponse)
      tweetResponse.forEach(function(element, elementIndex){
        element.forEach(function(element1, elementIndex1) {
            if(element1.place){
              var latitude = element1.place.bounding_box.coordinates[0][1][0];
              var longitude = element1.place.bounding_box.coordinates[0][1][1];
              addMarker(longitude,latitude);
            }
            if(element1.coordinates){
              var latitude = element1.coordinates.coordinates[0];
              var longitude = element1.coordinates.coordinates[1];
              addMarker(longitude,latitude);
            }
        });

    })

      })

  $(".menu-btn").click(function(event){
    event.preventDefault();
    $("nav").toggleClass("menushow");
  });
})



