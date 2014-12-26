var socket = io.connect();
var audioElement = document.createElement('audio');
var tracks = [];
var searching = false;
var currentTrack;
var isPlaying = false;
var trackResult;

function createRoom(name){

	socket.emit('createRoom', name);

}

$(window).load(function(){

	audioElement.setAttribute('src', '../sounds/welcome.wav');

	socket.on('join', function(roomName){

		setTimeout(function(){
			animateSpinnerOut();
			fadeOutpage();
			window.location.href = '/'+roomName;
		},2000);

	});

	socket.on('joinError', function(error){

		setTimeout(function(){
			slideErrorPanel(error);
			animateSpinnerOut();
		},2000);
	 
	});

	socket.on('userJoined', function(data){
		audioElement.play();

		$('#notify-icon').addClass('animated rubberBand');
		
		// Animation
		$('#notify-icon').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('#notify-icon').removeClass('animated rubberBand');
		});

	});

	socket.on('playTrack', function(data){
		//console.log(data);
		playTrack(data.id);
		fillPlayer(data.artwork, data.title);
	});

	SC.initialize({
		client_id: '9ef3139dcf622c37539360edd1909e53',
		redirect_uri: '636f66b1214404e96c75cfb83175a6f2',
	});


	$('input#searchBar').bind('input', function() {

		if(!searching && $(this).val() !== ''){
			searching = true;
    		animateSpinner();

	    	//Empty the container first before appending search results
	    	$('.trackContainer').empty('');

	       	SC.get('/tracks', { q: $(this).val(), limit: 50, artwork_url: 'crop'}, function(tracks) {

	       		animateSpinnerOut();
	       		searching = false;

	       		trackResult = tracks;

	       		tracks.forEach(function(entry,i){
		       		$("<div class='row track "+i+"' data-track-id='"+entry.id+"' id='myTrack'></div>").clone().appendTo('.trackContainer');
		       		$("<div class='twelve columns littleBoxContainer "+i+"'></div>").appendTo(".row.track."+i);
		       		if(entry.artwork_url){
		       			var artwork = entry.artwork_url.replace("large.jpg", "crop.jpg");
		       			$("<div class='littleBoxImage "+i+"' style= 'background-image: url("+artwork+")' </div>").appendTo(".twelve.columns.littleBoxContainer."+i);
		       		}else{
		       			$("<div class='littleBoxImage "+i+"' style= 'background-image: url(img/oops.png)' </div>").appendTo(".twelve.columns.littleBoxContainer."+i);
		       		}	
		       		$("<div class='littleBoxText'>"+entry.title+"</div>").appendTo(".twelve.columns.littleBoxContainer."+i);
	       		});

			});
		}

	});

	animateOnLoad();

	$('input#Btn').click(function(){
		if($('input#create_Session').val().length > 1){
			handleCreateClick();
		}else{
			slideErrorPanel('This name is not available, you should try another perharps :(');
		}
	});


	$('input#Btn_joinRoomBtn').click(function(){
		animateConfirmOut();
		socket.emit('joinRoom', $(this).attr('data-room-name'));
	});

	$('.trackContainer').on('click', '#myTrack', function() {

		var index = $(this).attr('class').split(' ').pop();
		//console.log(trackResult[index]);

		var roomName = $('input#Btn_joinRoomBtn').attr('data-room-name');
		var trackId  = $(this).attr('data-track-id');
		var trackArtwork  = trackResult[index].artwork_url;
		var trackTitle	 = trackResult[index].title;

   		socket.emit('playTrack', {name: roomName, id: trackId, artwork: trackArtwork, title: trackTitle});

	});


	$('#link-pop-icon').click(function(){
		if( $(".popUpBox").css('display') == 'none') {

			$('.popUpBox').css('display', 'block');
			$('.popUpBox').addClass('animated zoomIn');

		} else {

			$('.popUpBox').addClass('animated zoomOut');
			$('.popUpBox').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$('.popUpBox').css('display', 'none');
				$('.popUpBox').removeClass('animated zoomIn');
				$('.popUpBox').removeClass('animated zoomOut');
			});
		}
	});

	$('#player-option').click(function(){
		if(isPlaying){
			$('#player-option').attr('src', '../img/playicon.png');
			currentTrack.pause();
			isPlaying = false;
		}else{
			$('#player-option').attr('src', '../img/pauseicon.png');
			currentTrack.play();
			isPlaying = true;
		}
	});

});

function animateConfirmOut(){

	$('.static-confirm').css({
            '-webkit-transform': 'scale(5)',
            '-moz-transform': 'scale(5)',
            '-ms-transform': 'scale(5)',
            '-o-transform': 'scale(5)',
            'transform': 'scale(5)',
            'opacity': '0'
        });

	setTimeout(function(){
		$('.static-confirm').css('display', 'none');
	},500);
}

function fillPlayer(artwork, title){

	if(artwork){
		$('.player-iw-panel-Artwork').css('background-image',"url("+artwork+")");
	}else{
		$('.player-iw-panel-Artwork').css('background-image',"url(../img/oops.png)");
	}

	$('.player-iw-panel-Container').css('display','inline-block');

	$('.player-iw-panel-title-text').text(title);

	$('#player-option').attr('src', '../img/pauseicon.png');

	// Animation
	$('.player-iw-panel-Container').addClass('animated pulse');
	$('.player-iw-panel-Container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		$('.player-iw-panel-Container').removeClass('animated pulse');
	});

}

function playTrack(trackId){
	if(currentTrack){
		pauseCurrentTrack();
	}

	SC.stream("/tracks/"+trackId, function(sound){
		currentTrack = sound;
	  	sound.play();
	});

	isPlaying = true;

}

function pauseCurrentTrack(){
	currentTrack.pause();
}

function fadeOutpage(){
	$('#main').animate({opacity: 0}, 1000);
}


function slideErrorPanel(message){

	$('#errorPan').css('display', 'inline-block');
	$('#errorPan').text(message);
	$('#errorPan').addClass('animated fadeInDown');

	setTimeout(function(){

		$('#errorPan').addClass('animated fadeOutUp');

		$('#errorPan').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('#errorPan').removeClass('animated fadeInDown');
			$('#errorPan').removeClass('animated fadeOutUp');
			$('#errorPan').css('display', 'none');
		});
		
	},4000);
}

function animateSpinnerOut(){
	$('#spinner').addClass('animated bounceOut');
	$('#spinner').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		$('#spinner').css('display', 'none');
		$('#spinner').removeClass('animated bounceOut');
		$('#spinner').removeClass('animated bounceIn');
	});
}

function handleCreateClick(){
	animateSpinner();
	createRoom($('input#create_Session').val());
}

function animateSpinner(){
	$('#spinner').css('display', 'inline-block');
	$('#spinner').addClass('animated bounceIn');
}

function animateOnLoad(){

	setTimeout(function(){
		$('#main').animate({opacity: 1}, 500);
		$('#mainBody').css('visibility', 'visible');
    	$('#mainBody').animate({opacity: 1}, 1000);
    },500); 

	setTimeout(function(){
		$('#infoText').css('visibility', 'visible');
		$('#infoText').addClass('animated fadeInDown');
	},1500); 


	setTimeout(function(){
		$('#logo').css('display', 'none');
		$('#logo').css('display', 'inline-block');
		$('#logo').addClass('animated rubberBand');
	},4000); 
}