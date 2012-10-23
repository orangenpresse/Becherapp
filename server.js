var http = require('http');
var path = require('path');
var red = 0;
var green = 0;
var user = [];
var fs = require('fs');

http = http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
});

http.on('request', function(request, response) { 
	    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.htm';
     
    path.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
		    parseUrl(request.url);	
                    response.writeHead(200, { 'Content-Type': 'text/html' });
		    response.write("green: " + green + "<br />red: " + red)
                    response.end(content, 'utf-8');
		    
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
     
	
	
});


function parseUrl(param) {
	query = require('url').parse(param, true).query;

	switch (query.light) {
		case "red":
			red++;
		break;
		case "green":
			green++;	
		break;
	}
	
};

http.on('connection', function(socket) {
	user.push({"socket": socket, time: new Date().getTime()});
});

http.listen("8080");
