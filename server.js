#!/usr/local/bin/node

var http = require('http');
var path = require('path');
var fs = require('fs');
var app = require('./user.js');
var users = [];


http = http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});
});

http.on('request', function(request, response) {
	var filePath = getFilePath(request);
	
	fs.exists(filePath, function(exists) {

		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
				} else {
					app.parseParams(request, getUser(request));
					response.writeHead(200, {
						'Content-Type': 'text/html'
					});
					response.write("Stuck: " + count("Stuck")
						       + "<br />Hard: " + count("Hard")
						       + "<br />Good: " + count("Good")
						       + "<br /><br />Users: " + users.length
						       );
					response.end(content, 'utf-8');

				}
			});
		} else {
			response.writeHead(404);
			response.end();
		}
		
	});



});


function getFilePath(request) {
	var filePath = '.' + request.url.replace(/\?.*/g,"");
	if (filePath == './')
		return './index.html';
		
	return filePath;
}


function count(status) {
	var number = 0;
	
	for( var i = 0; i < users.length; i++) {
		if(users[i].user != null && users[i].user.status.value == status)
			number++;
	}
	
	return number;
}

function getUser(request) {
	//TODO session management
	for( var i = 0; i < users.length; i++) {
		if(users[i].socket == request.socket)
			return users[i];
	}
	return null;
}

http.on('connection', function(socket) {
	//TODO session management
	users.push({
		"socket": socket,
		user: null,
		time: new Date().getTime()
	});
});

http.listen("8080");

