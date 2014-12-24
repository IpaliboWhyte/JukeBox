var express = require('express');
var router = express.Router();
var roomNames = [];
var currentUrl = '';

/* GET url page. */
router.get('/juke/:id', function(req, res) {

	currentUrl = req.params.id;

	var roomIndex = roomNames.indexOf(currentUrl);
/*
	if(roomIndex == -1){
		res.send(currentUrl+' doesnt exist !');
		console.log('doesnt exixt');
	}else{
		res.render('index', { title: 'JukeBox Session' });
	}*/

	res.render('index', { title: 'JukeBox Session' });

});

/* GET home page. */
router.get('/', function(req, res) {

	res.render('index', { title: 'JukeBox Home' });

});

var io = require('../app');

io.on('connection', function (socket) {
	socket.on('createSession', function(room){
		roomNames.push(room.sessionName);
		socket.join(room.sessionName);
	});

	socket.on('joinSession', function(currentUrl){
		socket.join(currentUrl);
	});

});

module.exports = router;