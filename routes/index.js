var express = require('express');
var router = express.Router();
var roomNames = [];
var currentUrl = '';
var fs = require('fs');
var connectionCount = 0;

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

		/* Write to file */
		fs.appendFile(__dirname + '/trollDB/rooms.txt', "\n"+ room, function(err) {
		    if(err) {
		        //console.log(err);
		    } else {
		        //console.log("The file was saved!");
		    }
		}); 

		}else{
			socket.emit('joinError', ' Sorry, Name already exists')
		}

	});

	socket.on('joinRoom', function(room){

		socket.join(room);

		connectionCount++;

		console.log("New connection in "+ room +"'s room!");

		io.to(room).emit('userJoined', 'hi im in room ' + room );

						/* Write to file */
		fs.appendFile(__dirname + "/trollDB/connections.txt", "\nConnection Count: "+ connectionCount, function(err) {
		    if(err) {
		        //console.log(err);
		    } else {
		        //console.log("The file was saved!");
		    }
		}); 

	});

	socket.on('playTrack', function(data){
		//console.log(data);
		//console.log('should play')

		io.to(data.name).emit('playTrack', data);
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