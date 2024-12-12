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
//= require_tree .
var newGoogleMapsDestinationTemplate;
var currentLocation;
var markers = [];
var results;
function initialize() {
  navigator.geolocation.getCurrentPosition(function(position){
  currentLocation = ['Current Location', position.coords.latitude, position.coords.longitude, 4]
  locations = [currentLocation];

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
      // "elementType": "labels.icon",
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
      icon: '/assets/goat-pin.png',
      zIndex: google.maps.Marker.MAX_ZINDEX + 1,
      map: map
    });

    $(".loader").hide();

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
})
}
function updateTextInput(val) {
          document.getElementById('textInput').value=val + ' miles';
        }

$(document).ready(function(){


  $.ajax({
    url: '/',
    method: "GET",
    dataType: "JSON"
  })
  .fail(function(response){
    $('#login-blackout').show();
    $('#first-login').show()
    $('#first-login').html(response.responseText)
  })
  .done(function(response){
    $(".loader").show();
    var tweetResponse = response;

    $(".menu-btn").click(function(event){
      event.preventDefault();
      $(".nav1").toggleClass("menushow");
    });

    function addMarker(lat, long) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, long),
          icon: "https://s24.postimg.org/7ortwr045/pin.png",
          animation: google.maps.Animation.DROP,
          map: map
        });
        markers.push(marker)
        return marker
      }

    // Marker is clicked, slide out slidey
    function createLocationPage(newLat, newLong, element1){
        addMarker(newLat,newLong).addListener('click', function() {
          $.ajax({
            url: "/posts/show",
            method: "GET"
          })
          .done(function(response){
            console.log(element1)
            $(".nav2").addClass("menushow2");
            $('#slideout').html(response)
            newGoogleMapsDestinationTemplate = "https://www.google.com/maps/embed/v1/streetview?key=AIzaSyCOSRt1QlomEZuebiEqX7u1XEMJdfGdRNQ&location="+newLat+","+newLong;

            $("iframe").attr('src', newGoogleMapsDestinationTemplate);
            // // Adding screen_name, text, lat, long to sidebar. Choose either plaintext or HTML (see below):
            $('.twitter-avatar').html("<img src=" + element1.user.profile_image_url + "/>");
            $('.twitter-name').text(element1.user.name);
            $('.twitter-username').text("@" + element1.user.screen_name);
            $('.twitter-text').text(element1.text);
            $('.twitter-date').text(element1.created_at);
            if(element1.entities.media){
             $('.tweet-picture').html('<img src="'+element1.entities.media[0].media_url+'"></img>');
            }
            $('.twitter-icon').html('<a href="https://twitter.com/' + element1.user.screen_name + '"><i class="fa fa-twitter" aria-hidden="true"></i></a>')
          });
      });
    }

      //the tweet response is an array of arrays, each containing tweet object
      //the code below iterates through the tweet response array, and the contained sub arrays
      //for each tweet object it pulls the longitude and latitude depending on where they're stored
      //it then creates a map marker for each one
      tweetResponse.forEach(function(element, elementIndex){
        element.forEach(function(element1, elementIndex1) {
          if(element1.coordinates){
            var latitude = element1.coordinates.coordinates[1];
            var longitude = element1.coordinates.coordinates[0];
            createLocationPage(latitude, longitude, element1)
          }else if(element1.place){

            var latitude = element1.place.bounding_box.coordinates[0][1][1];
            var longitude = element1.place.bounding_box.coordinates[0][1][0];
            createLocationPage(latitude, longitude, element1)
          }else{
          }
          $(".loader").hide();
        });
  })

   $('.search-form').on('submit', function(event){
    markers.forEach(function(marker){ marker.setMap(null) });
    event.preventDefault();
    $('.loader').show()
    var data = $('.search-form').serialize() + '&lat=' + currentLocation[1] + '&long=' + currentLocation[2];
    console.log(data);
    $.get('/journeys/search', data)
      .done(function(response){
        response.forEach(function(element, elementIndex1) {
            if(element.coordinates){
              var latitude = element.coordinates.coordinates[1];
              var longitude = element.coordinates.coordinates[0];
              createLocationPage(latitude, longitude, element)
            }else if(element.place){
              var latitude = element.place.bounding_box.coordinates[0][1][1];
              var longitude = element.place.bounding_box.coordinates[0][1][0];
              createLocationPage(latitude, longitude, element)
            }
        });
      $('.loader').hide();
    })
  })

    $('body').on('click', '.journeylink', function(e){
    markers.forEach(function(marker){ marker.setMap(null) });
    e.preventDefault();
    $.ajax({
      url: $(this).attr('href'),
      method: "GET"
    })
    .done(function(response){
      $(".nav1").removeClass("menushow");
      $(".nav2").addClass("menushow2");
      $('#slideout').html(response);
      var results = JSON.parse($('.results-data').html())
      results.forEach(function(element, elementIndex){
        function imageMaker(element){
          if(element.entities.media){
          return "<img src='" + element.entities.media[0].media_url + "'></img>"
          } else { return ""}
        };
        $('.all-tweets').append(
          "<div class='tweet-details'>"+
            "<div class='tweet-user'>"+
              "<div class='tweet-user-left'>"+
                "<div class='twitter-avatar'><img src=" + element.user.profile_image_url + "/></div>"+
                "<div class='tweet-name-username'>"+
                  "<div class='twitter-name'>"+ element.user.name +"</div>"+
                  "<div class='twitter-username'>@" + element.user.screen_name +"</div>"+
                "</div>"+
              "</div>"+
              "<div class='tweet-user-right'>"+
                "<span class='twitter-icon'>"+
                  "<a href='https://twitter.com/'" + element.user.screen_name +
                  "><i class='fa fa-twitter' aria-hidden='true'></i></a></span>"+
              "</div>"+
            "</div>"+
            "<div class='tweet-content'>"+
              "<div class='tweet-picture'>" + imageMaker(element) +
              "</div>"+
              "<div class='twitter-text'>"+ element.text + "</div>"+
              "<div class='twitter-date'>"+ element.created_at +"</div>"+
            "</div>"+
            "</div>"+
          "</div>"
          );
        // if(element.entities.media){
        //  $('.tweet-picture').append('<img src="'+element.entities.media[0].media_url+'"></img>');
        // }
        if(element.coordinates){
          var latitude = element.coordinates.coordinates[1];
          var longitude = element.coordinates.coordinates[0];
          createLocationPage(latitude, longitude, element)
        }else if(element.place){
          var latitude = element.place.bounding_box.coordinates[0][1][1];
          var longitude = element.place.bounding_box.coordinates[0][1][0];
          createLocationPage(latitude, longitude, element)
        }
      })
    })
  })

})


  $(".menu-btn1").click(function(event){
    event.preventDefault();
    $("nav1").toggleClass("menushow");
  });

  $(".menu-btn2").click(function(event){
    event.preventDefault();
    $(".nav2").removeClass("menushow2");
  });

// First nav item is selected
  $(".menu-nav li").first().css('background-color', '#5f846c');
  $(".menu-nav li").click(function(event){
    $(this).siblings().css('background-color', '#719E81');
    $(this).css('background-color', '#5f846c');
  });


// Begin pop up modal
  $("a[href='/journeys/new']").on('click', function(e){
    e.preventDefault();
    $(".nav2").removeClass("menushow2");
    $('div#overlay').show();
    $('.close').on('click', function(){
      $('div#overlay').hide();
      $('#new_journey')[0].reset();
    })
    $('form#new_journey').on('submit', function(){
      $('#new_journey')[0].reset();
    })
  })

  // Pull up Journeys index once form is submitted
  $('input[value="Let\'s Go!"]').on('click', function(e){
    e.preventDefault();
    $.ajax({
    url: '/journeys',
    method: "POST",
    data: $('form#new_journey').serialize(),
    error: function(data){
        $('.errors').html('<p><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>Please enter a valid twitter user as your friend</p>');
        }
    })
    .done(function(response){
      $('div#overlay').hide();
      $(".nav2").addClass("menushow2");
      $('#slideout').html(response);
    });
  });

  // Click User, slide out Journey index
  $('#user-profile').on('click', function(e){
    e.preventDefault();
    $.ajax({
      url: '/journeys',
      method: "GET",
    })
    .done(function(response){
      $(".nav1").removeClass("menushow");
      $(".nav2").addClass("menushow2");
      $('#slideout').html(response);
    })
  })

  $('body').on('click', '.journeylink', function(e){
    e.preventDefault();
    $.ajax({
      url: $(this).attr('href'),
      method: "GET"
    })
    .done(function(response){
      $(".nav1").removeClass("menushow");
      $(".nav2").addClass("menushow2");
      $('#slideout').html(response);
    })
  })

  $('body').on('click', '.adventure', function(e){
    e.preventDefault();
    $.ajax({
      url: $(this).attr('href'),
      method: "GET"
    })
    .done(function(response){
      $(".nav1").removeClass("menushow");
      $(".nav2").addClass("menushow2");
      $('#slideout').html(response);
    })
    .fail(function(jqXHR, status, somethingElse){
      console.log(status)
      window.location = '/404'
    })
  })


  // Click Notices, slide out Journey index
  $('#invitations-nav').on('click', function(e){
    e.preventDefault();
    $.ajax({
      url: '/journeys',
      method: "GET",
    })
    .done(function(response){
      $(".nav1").removeClass("menushow");
      $(".nav2").addClass("menushow2");
      $('#slideout').html(response);
    })

  })

   $('body').on('click', '.response-input', function(e){
      e.preventDefault();
      var formData = $(this).parent().serialize();
      var current = $(this);
      var button = $(e.target);
      var formDataResult = formData + '&'
      + encodeURI(button.attr('name'))
      + '='
      + encodeURI(button.attr('value'));

      console.log(formDataResult)
      $.ajax({
        url: $(this).parent().attr('action'),
        method:"PUT",
        data: formDataResult
      })
      .done(function(response){

        console.log(response)
        current.hide()
        $(".nav1").removeClass("menushow");
        $(".nav2").addClass("menushow2");
        $('#slideout').html(response);

      })
   })

})
