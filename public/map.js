/* Inspired by SeedTip by Paul Dessert
** www.pauldessert.com | www.seedtip.com
*/

$(function() {
	
	//testing
	$('[data-toggle="popover"]').popover(); 
	var alert = document.getElementById("no-results");


	//Brewery Constructor
	function Brew(id, name, description, latitude, longitude){
		this.id = id,
		this.name = name,
		this.description = description,
		this.latitude = latitude,
		this.longitude = longitude
	}

	var brews = []; //array of brewery objects

	var allLatlng = []; //holds map boundaries 
	var allMarkers = []; //returned from the API
	var infowindow = null;
	var tempMarkerHolder = [];
		
	
	//map options
	var mapOptions = {
		zoom: 5,
		center: new google.maps.LatLng(37.09024, -100.712891),
		panControl: false,
		panControlOptions: {
			position: google.maps.ControlPosition.BOTTOM_LEFT
		},
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		scaleControl: false
	};
	
	//Adding infowindow option
	infowindow = new google.maps.InfoWindow({
		content: "holding..."
	});
	
	//Fire up Google maps and place inside the map-canvas div
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	//grab form data
    $('#chooseZip').submit(function() { // bind function to submit event of form
		
		//define and set variables
		var selection = $("#textZip").val();
	
		//stupid to place this inside the submit function???
		function buildMap(place, select){

			//since each search renders a new map, clear the brew list (for markers) !!!!!DOES NOT WORK!!!!
			//and the latling list (for map bounds) at the end of every search
			tempMarkerHolder = [];
			allLatlng = [];
			alert.style.visibility='hidden';

			//used for checking errors
			var searchTerm = place;

			$.getJSON("/brewery/locations?key=e8a3ba093c9ed5f28142c15a388a54da&" + place + "=" + select)
	        
	        .then(function(data, second, third) {
	        	
	        					        		console.log(brews);

		        	//if no results, try using the locality search
		    		if(!data.data &&  searchTerm === 'locality'){
		    			console.log("No results, terminating");

		    			//dont like tossing this in here, figure out a better way
						alert.style.visibility='visible';
		    			return;
		    		}else{
						if(!data.data){
							console.log(searchTerm);
			        		console.log('trying locality search...');
			        		buildMap("locality", select);
		        		};
		    		};        	

		        	function Brew(id, name, description, latitude, longitude){
						this.id = id,
						this.name = name,
						this.description = description,
						this.latitude = latitude,
						this.longitude = longitude
					}

		   		 	$.each(data.data, function(i, val){
		   		 		var id = val.id;
		   		 		var name = val.brewery.name;
		   		 		var description = val.brewery.description || "No description";
		   		 		var latitude = parseFloat(val.latitude);
		   		 		var longitude = parseFloat(val.longitude);

		   		 		brews.push(new Brew(id, name, description, latitude, longitude));
		   		 	});
				


				//set the markers.
				$.each(brews, function(i, val){
					var lat = val.latitude;
					var long = val.longitude;
					myLatlng = new google.maps.LatLng(lat,long);

					allMarkers = new google.maps.Marker({
						position: myLatlng,
						map: map,
						title: val.name,
						animation: google.maps.Animation.DROP,
						html: 
								'<div class="markerPop">' +
								'<h1>' + val.name + '</h1>' + //substring removes distance from title
								'<p>' + val.description + '</p>' +
								'</div>'
					});			

					//put all lat long in array
					allLatlng.push(myLatlng);
					
					//Put the marketrs in an array
					tempMarkerHolder.push(allMarkers);
						google.maps.event.addListener(allMarkers, 'click', function () {
						infowindow.setContent(this.html);
						infowindow.open(map, this);
					});
				});  

				//set the map boundaries
				var bounds = new google.maps.LatLngBounds ();
				
				for (var i = 0; i < allLatlng.length; i++) {
					//  increase the bounds to take this point
					bounds.extend (allLatlng[i]);
				}

				//  Fit these bounds to the map
				map.fitBounds (bounds);

	        }).fail(function(){
	        	console.log('Fail');
	        });

		}

		//initialize
		buildMap("region", selection);

        return false; // important: prevent the form from submitting
    });



});

