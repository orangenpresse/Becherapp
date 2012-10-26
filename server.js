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

app.use("/", express.static(__dirname + '/public'))
app.use("/admin", express.basicAuth('username', 'password'));

app.get('/admin', function(req, res) {
	res.end();
});

setInterval(becher.checkUsers, 5000, 5000);

app.get('/update-stream', function(req, res) {
	req.socket.setTimeout(Infinity);

	becher.addSSE(req, res);

	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	res.write('\n');

	becher.sendDataToUsers();

	req.on("close", function() {
		becher.closeSSE(res);
		becher.sendDataToUsers();
	});
});

app.get('/update-status', function(req, res) {
	becher.parseParams(req);
	becher.sendDataToUsers();
	res.end();
});

app.listen("8080");