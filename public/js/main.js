var socket = io.connect('http://localhost:4000');

function creatRoom(){
	socket.emit('createSession', {sessionName: 'RichGang'});
}

function joinRoom(){
	socket.emit('joinSession', {sessionName: 'RichGang'})
}

$(document).ready(function(){
	animateOnLoad();
});

function animateOnLoad(){

	setTimeout(function(){
		$('#main').css('visibility', 'visible');
    	$('#main').animate({opacity: 1}, 3000, function(){
    	});
    },500); 

	setTimeout(function(){
		$('#infoText').css('visibility', 'visible');
		$('#infoText').addClass('animated fadeInDown');
	},2000); 


	setTimeout(function(){
		$('#logo').css('display', 'none');
		$('#logo').css('display', 'inline-block');
		$('#logo').addClass('animated rubberBand');
	},6000); 



	//$('.row#formField').addClass('animated fadeInUp');
}