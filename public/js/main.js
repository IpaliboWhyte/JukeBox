var socket = io.connect('http://localhost:4000');

function creatRoom(){
	socket.emit('createSession', {sessionName: 'RichGang'});
}

function joinRoom(){
	socket.emit('joinSession', {sessionName: 'RichGang'})
}