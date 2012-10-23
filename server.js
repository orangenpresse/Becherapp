var http = require('http');
var red = 0;
var green = 0;
var user = [];
 
http = http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
});

http.on('request', function(request, response) { 
	//for(var i = 0; i < user.length; i++) {
	//	if( user[i].socket == request.socket )
	//		response.write("Das ist der Client");
	//}	

	
	parseUrl(request.url);	
	response.write("Red: " + red + " - Green: " + green);
	response.end();  	
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
