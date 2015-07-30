var map;
var geocoder; //To use later
var storeArray = [];
var markersArray = [];
var storesTextArray = [];
var currentPhoneNumber;

function initialize() {
    
    console.log('initialize');
    
    geocoder = new google.maps.Geocoder();
    
  var mapOptions = {
      zoom: 12
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
    
     google.maps.event.addListener(map, 'tilesloaded', function(){
        console.log ('GOOGLE MAP LOADED');
        $('#map-canvas').css('opacity', '1'); 
        $('.loc-footer').css('opacity', '1'); 
    });

          // Try HTML5 geolocation
          if(navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);

              map.setCenter(pos);

            getStoresFromJSON(position.coords.latitude, position.coords.longitude);


            }, function() {
              handleNoGeolocation(true);
            });
          } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
          }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}


//Call this wherever needed to actually handle the display
function codeAddress(zipCode) {
    console.log('coding address');
    geocoder.geocode( { 'address': zipCode}, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
          
          var lat = results[0].geometry.location.lat();
          var lon = results[0].geometry.location.lng();
          
          getStoresFromJSON(lat, lon);
        
        //Got result, center the map and put it out there
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
          
        map.setZoom(12);
          
        setMarkers();
          
          //return results;
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

function getStoresFromJSON(lat, lon) {
 
    storeArray=[];
    
        var storeLocations = $.ajax( '/api/stores?lat=' + lat + '&lon=' + lon )
       .done(function(data) {
           
           //store results
            for (var x = 0; x < data.length; x++) {

                storeArray.push(data[x]);     
                
                if(data.length-1 == x) { setMarkers()};
            }
           
        })
        .fail(function() {
            console.log('API AJAX FAIL');
        })
         .always(function() {
            console.log('API AJAX COMPLETE');
        });

}


function setMarkers() {

    console.log ('ADDING MARKERS');
    deleteMarkers();
    //clearMarkers();

  // Marker sizes are expressed as a Size of X,Y
  // where the origin of the image (0,0) is located
  // in the top left of the image.

  // Origins, anchor positions and coordinates of the marker
  // increase in the X direction to the right and in
  // the Y direction down.
  var defaultIcon = {
    url: '../images/map-icon-grey.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(35, 50),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(17, 50)
  };
    
   var activeIcon = {
    url: '../images/map-icon-red.png',
      // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(35, 50),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(17, 50)
    };
  // Shapes define the clickable region of the icon.
  // The type defines an HTML &lt;area&gt; element 'poly' which
  // traces out a polygon as a series of X,Y points. The final
  // coordinate closes the poly by connecting to the first
  // coordinate.
  var shape = {
      coords: [1, 1, 35, 1, 30, 45, 5, 45],
      type: 'poly'
  };
    
  for (var i = 0; i < storeArray.length; i++) {
      
    var lat = storeArray[i].store.lat;
    var lng = storeArray[i].store.lon;
    var myLatLng = new google.maps.LatLng(lat, lng);
    var infowindow = new google.maps.InfoWindow({
      content: ""
    });
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: defaultIcon,
        shape: shape,
        infoWindow: infowindow,
        title: storeArray[i].store.name,
        content: storeArray[i].store.address,
        center: myLatLng,
        index: i
    });

    //add click event to view location data
    google.maps.event.addListener(marker, 'click', function() {
        
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].infoWindow.close();
        }
        
        for (var i = 0; i < storesTextArray.length; i++) {     
            $(storesTextArray[i]).fadeTo( 0 , 1.0);
        }
        
       // console.log (this.index);
        
        $(storesTextArray[this.index]).fadeTo( .5 , .5);
        
        var contentString = "<font color='black'><b>" + this.title + '</b><br>' + this.content + '</font>';
        this.infoWindow.setContent(contentString);
        this.infoWindow.open(map,this);

        map.panTo(this.position);
        
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setIcon(defaultIcon);
            markersArray[i].setZIndex(i);
        }

        this.setIcon(activeIcon);
        this.setZIndex(markersArray.length + 10);
        
        if ($('#video-container').css('display') == 'none' && smallScreen == true){
            //for mobile
            $('.mobile-search-result').html("");
            content = Math.round((storeArray[this.index].distance) * 0.621371192 * 10) / 10 + ' miles';
            content += '<br>';
            content += storeArray[this.index].store.name;
            content += '<br>';
            content += storeArray[this.index].store.address;
            $('.mobile-search-result').append(content);
            updatePhone(this.index);
        }
        
        $('.mobile-phone').css('visiblity', 'visible');

    }); 
      
       markersArray.push(marker);
  }
    
        if (isTouch() && smallScreen == true){ labelNearestStore();  };
        
        //add listener for phone dialing
        $('.mobile-phone').click(function () {
            //alert(currentPhoneNumber); 
            document.location='tel:' + currentPhoneNumber;
        }); 

        //clear previous query
        storesTextArray = [];
        $(".desktop-results").html("");
        
        for (var i = 0; i < storeArray.length; i++) {
            
            var clickObject = ('store' + i).toString();
  
            content = '<a class='+clickObject+' >' + storeArray[i].store.name;
            content += '<br>';
            content += storeArray[i].store.address + '</a>';
            content += '<br>';
            content += "<hr class='hr'>";
            content += '<br>';
            
            var htmlNode = document.createElement('a');
            htmlNode.innerHTML = content
            htmlNode.index = i;
            
            storesTextArray.push(htmlNode);
            
            $('.desktop-results').append(htmlNode);
            
            $(htmlNode).click(function () {
                
               // console.log('click ' + this.index);
                
                for (var i = 0; i < storesTextArray.length; i++) {
                    
                    $(storesTextArray[i]).fadeTo( 0 , 1.0);
                }
                
                for (var i = 0; i < markersArray.length; i++) {
                    markersArray[i].setIcon(defaultIcon);
                }
                
                markersArray[this.index].setIcon(activeIcon);
                $( this ).fadeTo( .5 , 0.5);

            });
            
            /*$(htmlNode).hover(function () {

                for (var i = 0; i < storesTextArray.length; i++) {
                    
                    $(storesTextArray[i]).fadeTo( 0 , 1.0);
                }
                
                for (var m = 0; m < markersArray.length; m++) {
                    markersArray[m].infoWindow.close();
                    markersArray[m].setIcon(defaultIcon);
                    markersArray[m].setZIndex(m);
                }
                
                $( this ).fadeTo( .5 , 0.5);
                markersArray[this.index].setIcon(activeIcon);

            });*/
            
        }

}

function deleteMarkers() {
   // console.log(markersArray.length);
    for (var i = 0; i < markersArray.length; i++) {
        
        markersArray[i].setMap(null);
    }
    markersArray=[];
}

function storeButtonClick() {
    
}

    //
    //(if mobile)
    //
function labelNearestStore() {
    
    $('.mobile-search-result').html("");
    content = Math.round((storeArray[0].distance) * 0.621371192 * 10) / 10 + ' miles';
    content += '<br>';
    content += storeArray[0].store.name;
    content += '<br>';
    content += storeArray[0].store.address;
    $('.mobile-search-result').append(content);
    updatePhone(0);
}

    //
    //(if mobile)
    //
function updatePhone(index) {
 
    currentPhoneNumber = storeArray[index].store.phone;
    console.log(currentPhoneNumber);
    
}


//
//LISTENERS FOR GOOGLE MAPS LOADING
//

