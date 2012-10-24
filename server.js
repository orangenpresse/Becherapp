#!/usr/local/bin/node

var express = require("express");
var path = require('path');
var fs = require('fs');
var app = express();

var becher = require('./user.js');

app.use(express.cookieParser());
app.use(express.cookieSession({
	key: "becherapp",
	secret: new Date().getTime().toString()	
}));


app.get( /.*/,function(req, res) {
	var filePath = getFilePath(req);
	
	fs.exists(filePath, function(exists) {

		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					res.send(500);
				} else {
					becher.parseParams(req);
					res.set('Content-Type', 'text/html');
					
					res.send("Stuck: " + becher.count("stuck")
						+ "<br />Hard: " + becher.count("hard")
						+ "<br />Good: " + becher.count("good")
						+ "<br /><br />Users: " + becher.count("users")
						+ content
						);

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


