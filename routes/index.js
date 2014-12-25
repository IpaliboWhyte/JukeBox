var express = require('express');
var router = express.Router();
var roomNames = [];
var currentUrl = '';

/* GET url page. */
router.get('/:id', function(req, res) {

	currentUrl = req.params.id;

	// if it doesn't exist
	if(validateRoom(currentUrl)){
		res.send(currentUrl+ 'Sorry this doesnt exist !');
	}else{
		res.render('confirm', { title: currentUrl });
	}

});

/* GET home page. */
router.get('/', function(req, res) {

	res.render('index', { title: 'JukeBox - Share a Playlist' });

});

var io = require('../app');

io.on('connection', function (socket) {

	socket.on('createRoom', function(room){
		if(validateRoom(room)){
			roomNames.push(room);
			socket.emit('join', room)

		}else{
			socket.emit('joinError', ' Sorry, Name already exists')
		}

	});

	socket.on('joinRoom', function(room){
		console.log('a user just joined room: '+ room);
		socket.join(room);
	});

});

function validateRoom(name){
	if (roomNames.indexOf(name) == -1 ){
		return true;
	}else{
		return false;
	}
}

module.exports = router;