var socket = io.connect();
var tracks = [];
var searching = false;
var currentTrack;

function createRoom(name){

	socket.emit('createRoom', name);

}

$(document).ready(function(){

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
		console.log(data);
	});

	socket.on('playTrack', function(id){
		playTrack(id);
	});

	SC.initialize({
		client_id: '9ef3139dcf622c37539360edd1909e53',
		redirect_uri: '636f66b1214404e96c75cfb83175a6f2',
	});

	$('input#searchBar').bind('input', function() {

		animateSpinner();

		if(!searching && $(this).val() !== ''){
			searching = true;
    		
	    	//Empty the container first before appending search results
	    	$('.trackContainer').empty('');
	       	SC.get('/tracks', { q: $(this).val(), limit: 50, artwork_url: 'crop'}, function(tracks) {
	       		animateSpinnerOut();
	       		searching = false;
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
		$('.static-confirm').css('display', 'none');
		socket.emit('joinRoom', $(this).attr('data-room-name'));
	});

	$('.trackContainer').on('click', '#myTrack', function() {
   		socket.emit('playTrack', {name: $('input#Btn_joinRoomBtn').attr('data-room-name'), trackId: $(this).attr('data-track-id')});
	});

});

function playTrack(trackId){
	if(currentTrack){
		pauseCurrentTrack();
	}

	SC.stream("/tracks/"+trackId, function(sound){
		currentTrack = sound;
	  	sound.play();
	});
}

function pauseCurrentTrack(){
	currentTrack.pause()
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
	},6000); 
}