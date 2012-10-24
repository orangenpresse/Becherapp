/*
 * holds users
 */
var users = {};

/*
 * 5 seconds in ms
 */
const fiveSeconds = 5000;

/*
 * User prototype
 */
function User(sessionId) {
	
	this.sessionId = sessionId;
	this.status = new None();
	this.lastActivity = new Date().getTime();
	
	this.setLastActivity = function() {
		this.lastActivity = new Date().getTime();
	}
	
	this.getLastActivity = function() {
		return this.lastActivity
	}
	
	this.setStatus = function(status) {
		this.status = status;
	}
	
	this.getStatus = function(status) {
		return this.status;
	}
}

/*
 * Status protoypes
 */
function None() {
	this.value= "none";
}

function Stuck() {
	this.value= "stuck";
}

function Hard() {
	this.value= "hard";
}

function Good() {
	this.value= "good";
}

/*
 * Checks if clients are active
 */
function checkUsers(activeTime) {
	var timeNow = new Date().getTime();
	
	for( var user in users) {
		if(users[user].getLastActivity() < timeNow - activeTime)
			delete users[user];
		
	}
}

/*
 * Registers User session
 */
function registerUser(reg) {
	var sessionId = new Date().getTime().toString() + Object.keys(users).length.toString();
	reg.session = sessionId;
	users[sessionId] = new User(sessionId);
	
	return users[sessionId];
}

/*
 * Gets the User by request
 */
function getUser(req) {
	if(users[req.session] != undefined) {
		return users[req.session];
	}
	else {
		return registerUser(req);
	}
}

/*
 * Counts users or status
 */
function count(value) {
	if(value == "users")
		return  Object.keys(users).length;
	
	var count = 0;
	
	for( var user in users) {
		if(users[user].status.value == value)
			count++;
	}
	
	return count;
}

/*
 * Parses the request params and starts the logic
 */
function parseParams(req) {
	var user = getUser(req);
	user.setLastActivity();
	
	checkUsers(fiveSeconds);
	
        return setStatus(req, user);
};

/*
 * Sets the status by query.status
 */
function setStatus(request, user) {
	query = require('url').parse(request.url, true).query;
	
	switch (query.status) {
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
module.exports.count = count;