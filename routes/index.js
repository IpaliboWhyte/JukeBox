var express = require('express');
var router = express.Router();
var roomNames = {};
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

			roomNames[room] = {
				users: 0, 
				currentTrack: null
			};

			console.log(roomNames)
			
			//roomNames.push(room);
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
		socket.name = room;

		roomNames[room].users += 1;

		//For file
		connectionCount++;

		console.log("New connection in "+ room +"'s room!");

		io.to(room).emit('userJoined', roomNames[room]);

						/* Write to file */
		fs.appendFile(__dirname + "/trollDB/connections.txt", "\nConnection Count: "+ connectionCount, function(err) {
		    if(err) {
		        //console.log(err);
		    } else {
		        //console.log("The file was saved!");
		    }
		}); 

		//console.log('there are '+Object.keys(_room).length+' connections in room '+ room)

	});

	socket.on('_playTrack', function(data){

		io.to(data.name).emit('play-Track', data);
		roomNames[data.name].currentTrack = data;
	});

	socket.on('disconnect', function() {
		
		if(socket.name && roomNames[socket.name].users){
			roomNames[socket.name].users--;
			io.to(socket.name).emit('userLeft', roomNames[socket.name].users);
	    }

	});

});

function validateRoom(name){
	if (!roomNames[name]){

		//returns true if name doesn't exists
		return true;
	}else{

		//returns true if name exists
		return false;
	}
}

module.exports = router;