function User() {
	this.status = new White();
	
	this.setStatus = function(status) {
		this.status = status;
	}
	
	this.getStatus = function(status) {
		return status.color;
	}
}

function White() {
	this.color = "white";
}

function Red() {
	this.color = "Red";
}

function Yellow() {
	this.color = "Yellow";
}

function Green() {
	this.color = "Green";
}

function parseParams(request, user) {
	if(user != null)
		setStatus(request, user);
};

function setStatus(request, user) {
	query = require('url').parse(request.url, true).query;
	
	switch (query.light) {
		case "red":
			user.setStatus(new Red());
			break;
		case "yellow":
			user.setStatus(new Yellow());
			break;
		case "green":
			user.setStatus(new Green());
			break;
	}
}

module.exports.parseParams = parseParams;
module.exports.User = User;
module.exports.White = White;
module.exports.Red = Red;
module.exports.Yellow = Yellow;
module.exports.Green = Green;