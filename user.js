/*
 * 5 seconds in ms
 */
const fiveSeconds = 5000;

/*
 * User prototype
 */
function User(sessionId) {
	
	this.sse = null;
	this.sessionId = sessionId;
	this.status = new None();
	this.lastActivity = new Date().getTime();
	this.active = true;
	
	this.sendData = function(data) {
		if(this.sse != null)
			this.sse.write('data: ' + data + '\n\n'); 
	}
	
	this.setLastActivity = function() {
		this.active = true;
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

function Becher() {
	/*
	 * holds users
	 */
	this.users = {};
	
	/*
	* Checks if clients are active
	*/
       this.checkUsers = function(activeTime) {
	       var timeNow = new Date().getTime();
	       
	       for( var user in this.users) {
		       if(this.users[user].getLastActivity() < timeNow - activeTime)
			       delete this.users[user];
		       
	       }
       }
       
       /*
	* Registers User session
	*/
       this.registerUser = function(reg) {
	       var sessionId = new Date().getTime().toString() + Object.keys(this.users).length.toString();
	       reg.session = sessionId;
	       this.users[sessionId] = new User(sessionId);
	       
	       console.log("New User:" + sessionId);
	       
	       return this.users[sessionId];
       }
       
        /*
	* Gets the User by request
	*/
       this.getUser = function(req) {
	       if(this.users[req.session] != undefined) {
		       return this.users[req.session];
	       }
	       else {
		       return this.registerUser(req);
	       }
       }
       
       
       /*
        * Adds Server Site Event to User
        */
       this.addSSE = function(req, res) {
		var user = this.getUser(req);
		user.sse = res;
		user.setLastActivity();
       }
       
       /*
        * Remove SSE and User
        */
       this.closeSSE = function(res) {
	       for( var user in this.users) {
		       if(this.users[user].sse == res)
			       this.users[user].active = false;
	       }
       }
       
       this.sendDataToUsers = function(data) {
	 for( var user in this.users) {
			this.users[user].sendData(data);
	       }
       }
       
       /*
	* Counts users or status
	*/
	this.count = function(value) {
		var count = 0;
	        if(value == "users") {
		       for( var user in this.users) {
				if(this.users[user].active)
				count++;
			}
			
			return count;
	        }
	       
	        for( var user in this.users) {
		       if(this.users[user].active && this.users[user].status.value == value)
			       count++;
	        }
	       
	       return count;
       }
       
       /*
	* Parses the request params and starts the logic
	*/
       this.parseParams = function(req) {
	       var user = this.getUser(req);
	       user.setLastActivity();
	       
	       // Vanish Time Feature
	       //this.checkUsers(fiveSeconds);
	       
	       this.setStatus(req, user);
       };
       
       /*
	* Sets the status by query.status
	*/
       this.setStatus = function (request, user) {
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
}

function becher() {
	return new Becher();
}

module.exports.becher = becher;
