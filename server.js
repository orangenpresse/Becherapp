#!/usr/local/bin/node

var express = require("express");
var path = require('path');
var fs = require('fs');
var app = express();

var becher = require('./user.js');
var becher = becher.becher();

app.use(express.cookieParser());
app.use(express.cookieSession({
	key: "becherapp",
	secret: new Date().getTime().toString()	
}));

var connections = [];

app.get('/update-stream', function(req, res) {
  // let request last as long as possible
  req.socket.setTimeout(Infinity);

  becher.addSSE(req, res);
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  req.on("close", function() {
	becher.closeSSE(res);
	
	var data = (
		"Stuck: " + becher.count("stuck")
		+ "<br />Hard: " + becher.count("hard")
		+ "<br />Good: " + becher.count("good")
		+ "<br /><br />Users: " + becher.count("users")
	);
	becher.sendDataToUsers(data);
  });
});

app.get(/.*/,function(req, res) {
	//TODO Template Engine
	var filePath = getFilePath(req);
	
	fs.exists(filePath, function(exists) {

		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					res.send(500);
				} else {
					becher.parseParams(req);
					
					res.set('Content-Type', 'text/html');
					
					var data = (
						"Stuck: " + becher.count("stuck")
						+ "<br />Hard: " + becher.count("hard")
						+ "<br />Good: " + becher.count("good")
						+ "<br /><br />Users: " + becher.count("users")
						);
					
					res.send('<div id="status">' + data  + '</div>' + content);
					
					becher.sendDataToUsers('<div id="status">' + data  + '</div>');

				}
			});
		} else {
			res.send(404);
		}
		
	});
});

function getFilePath(req) {
	var filePath = '.' + req.path;
	if (filePath == './')
		return './index.html';
		
	return filePath;
}

app.listen("8080");


