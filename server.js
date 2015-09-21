// WebSocket server library
var WebSocket = require('ws');
// GUID generator
var uuid = require('node-uuid');
// WebSocket Server
var ws = new WebSocket.Server({port: 3000});

// Users info
var users = {};
// List of online users
var usersOnline = [];
// All messages
var messages = [];

ws.on('connection', function (socket) {
	// Username of WebSocket client
	socket.username = undefined;
	/**
	 * On get message from client
	 */
	socket.on('message', function (message) {
		try {
			var msg = JSON.parse(message);
			switch (msg.type) {
				case 'login':
				{
					var result = loginUser(msg.username, msg.guid, socket);
					var msgToSend;
					if (result.status == 0) {
						socket.username = msg.username;
						sendMessage({text: 'User ' + socket.username + ' connected'});
						log(msg);
						msgToSend = {
							status: 'ok',
							username: msg.username,
							guid: result.guid
						};
						sendUserList();
					} else {
						msgToSend = {
							status: 'error',
							code: result.status,
							message: result.message
						}
					}
					msgToSend.type = 'login';
					socket.send(JSON.stringify(msgToSend));
					break;
				}
				case 'message':
				{
					delete msg.type;
					msg.sender = socket.username;
					msg.timestamp = Date.now();
					messages.push(msg);
					log(msg);
					sendMessage(msg);
				}
			}
		} catch (ex) {
			console.log(ex);
		}
	});

	socket.on('close', function () {
		logoutUser(socket.username);
		sendUserList();
	});

	socket.sendAfterLogout = function (logoutTime) {
		messages
			.filter(function (msg) {
				return msg.timestamp > logoutTime;
			})
			.forEach(function (msg) {
				msg.type = 'message';
				socket.send(JSON.stringify(msg));
			})
	};
});

/**
 * Send message for all users
 * @param msg {object} Message
 * @param msg.text {string} Message text
 * @param msg.timestamp {number} Timestamp
 * @param msg.[sender] {string} Who send this message
 */
function sendMessage(msg) {
	msg.type = 'message';
	msg = JSON.stringify(msg);
	ws.clients.forEach(function (client) {
		if (client.username) {
			client.send(msg);
		}
	});
}

/**
 * Send current users list
 */
function sendUserList() {
	var msg = JSON.stringify({
		type: 'usersList',
		list: usersOnline
	});
	ws.clients.forEach(function (client) {
		if (client.username) {
			client.send(msg);
		}
	});
	console.log('sendUserList:' + msg);
}

/**
 * Login user
 * @param username {string} User login
 * @param [guid] {string} User guid
 * @param socket {WebSocket} Client socket to send messages
 * @param socket.sendAfterLogout {function} Send all messages after user logout
 * @returns {{status: number, [guid]: string, [message]: string}}
 */
function loginUser(username, guid, socket) {
	var result;
	if (users[username]) {
		// User offline
		if (!users[username].isOnline) {
			if (users[username].guid === guid) {
				// Same user
				users[username].isOnline = true;
				usersOnline.push(username);
				socket.sendAfterLogout(users[username].logoutTime);
				result = {
					status: 0,
					guid: users[username].guid
				}
			} else {
				// Another user
				result = {
					status: 1,
					message: 'Wrong GUID for user'
				}
			}
		} else {
			result = {
				status: 2,
				message: 'User already online'
			}
		}
	} else {
		users[username] = {
			logoutTime: null,
			isOnline: true,
			guid: uuid.v1()
		};
		usersOnline.push(username);
		result = {
			status: 0,
			guid: users[username].guid
		};
	}
	return result;
}

/**
 * Action on user logging out.
 * Set logout time for
 * @param username {string}
 */
function logoutUser(username) {
	if (username) {
		users[username].logoutTime = Date.now();
		users[username].isOnline = false;
		usersOnline.splice(usersOnline.indexOf(username), 1);
		sendMessage({text: 'User ' + username + ' disconnected'});
	}
}

function log(msg, funcName) {
	if (typeof msg != 'string') {
		msg = JSON.stringify(msg);
	}
	if (funcName) {
		console.log(funcName, msg);
	} else {
		console.log(msg);
	}
}

log('server started');
