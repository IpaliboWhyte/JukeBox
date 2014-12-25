var socket = io.connect('http://localhost:3000');

function createRoom(name){
	socket.emit('createRoom', name);
	socket.on('join', function(roomName){

		socket.emit('joinRoom', name);

		setTimeout(function(){
			animateSpinnerOut();
			fadeOutpage();
			window.location.href = "/"+name;
		},2000);

	});

	socket.on('joinError', function(error){

		setTimeout(function(){
			slideErrorPanel(error);
			animateSpinnerOut();
		},2000);
	 
	});
}

$(document).ready(function(){
	animateOnLoad();

	$('input#Btn').click(function(){
		if($('input#create_Session').val().length > 1){
			handleCreateClick();
		}else{
			slideErrorPanel('This name is not available, you should try another perharps :(');
		}
	});


	$('input#Btn_joinRoomBtn').click(function(){
		socket.emit('joinRoom', $(this).attr('data-room-name'));
	});

});

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