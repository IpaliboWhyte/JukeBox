var socket = io.connect('http://localhost:4000');

function createRoom(name){
	socket.emit('createRoom', name);
	socket.on('join', function(roomName){

		socket.emit('joinRoom', name);
		setTimeout(function(){
		animateSpinnerOut();
			window.location.href = "/"+name;
		},2000);

	});

	socket.on('joinError', function(error){

		setTimeout(function(){
			alert(error);
			animateSpinnerOut();
		},2000);
	 
	});
}

$(document).ready(function(){
	animateOnLoad();

	$('input#Btn').click(function(){
		handleCreateClick();
	});


	$('input#Btn_joinRoomBtn').click(function(){
		socket.emit('joinRoom', $(this).attr('data-room-name'));
	});


});

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
		$('#main').css('visibility', 'visible');
    	$('#main').animate({opacity: 1}, 3000, function(){
    	});
    },500); 

	setTimeout(function(){
		$('#infoText').css('visibility', 'visible');
		$('#infoText').addClass('animated fadeInDown');
	},3000); 


	setTimeout(function(){
		$('#logo').css('display', 'none');
		$('#logo').css('display', 'inline-block');
		$('#logo').addClass('animated rubberBand');
	},6000); 
}