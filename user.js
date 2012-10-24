function User() {
	this.status = new None();
	
	this.setStatus = function(status) {
		this.status = status;
	}
	
	this.getStatus = function(status) {
		return status.color;
	}
}

function None() {
	this.value= "None";
}

function Stuck() {
	this.value= "Stuck";
}

function Hard() {
	this.value= "Hard";
}

function Good() {
	this.value= "Good";
}

function parseParams(request, user) {
	if(user.user != null)
	    return setStatus(request, user.user);

        user.user = new User();
        return setStatus(request, user.user);
};

function setStatus(request, user) {
	query = require('url').parse(request.url, true).query;
	
	switch (query.light) {
		case "stuck":
			user.setStatus(new Stuck());
			break;
		case "hard":
			user.setStatus(new Hard());
			break;
		case "good":
			user.setStatus(new Good());
			break;
	}
}

module.exports.parseParams = parseParams;