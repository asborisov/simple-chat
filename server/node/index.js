// WebSocket server library
const WebSocket = require('ws');
// GUID generator
const uuid = require('uuid');
// WebSocket Server
const ws = new WebSocket.Server({port: 3000});

// Users info
let users = {};
// List of online users
const usersOnline = [];
// All messages
const messages = [];

ws.on('connection', socket => {
    // Username of WebSocket client
    socket.username = undefined;
    /**
     * On get message from client
     */
    socket.on('message', message => {
        try {
            const msg = JSON.parse(message);
            switch (msg.type) {
                case 'login': {
                    const result = loginUser(msg.username, msg.guid, socket);
                    let msgToSend = {};
                    if (result.status === 0) {
                        socket.username = msg.username;
                        sendMessage({
                            text: 'User ' + socket.username + ' connected',
                        });
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
                case 'message': {
                    delete msg.type;
                    msg.author = socket.username;
                    messages.push(msg);
                    log(msg);
                    sendMessage(msg);
                    break;
                }
                default:
                    log(`Unexpected message: ${message}`);
                    break;
            }
        } catch (ex) {
            log(ex);
        }
    });

    socket.on('close', () => {
        logoutUser(socket.username);
        sendUserList();
    });

    socket.sendAfterLogout = logoutTime =>
        messages
            .filter(msg => msg.timestamp > logoutTime)
            .forEach(msg => socket.send(JSON.stringify(Object.assign({}, msg, {type: 'message'}))));
});

/**
 * Send message for all users
 * @param msg {object} Message
 * @param msg.type {string} Message type
 * @param msg.text {string} Message text
 * @param msg.timestamp {number} Timestamp
 * @param msg.[sender] {string} Who send this message
 */
const sendMessage = msg => {
    msg = JSON.stringify(Object.assign({
        type: 'message',
        ts: +(new Date()),
        author: '',
        uid: uuid.v1()
    }, msg));
    ws.clients.forEach(client => {
        if (client.username) {
            client.send(msg);
        }
    });
};

/**
 * Send current users list
 */
const sendUserList = () => {
    const msg = JSON.stringify({
        type: 'usersList',
        list: usersOnline
    });
    ws.clients.forEach(client => {
        if (client.username) {
            client.send(msg);
        }
    });
    log('sendUserList:' + msg);
};

/**
 * Login user
 * @param username {string} User login
 * @param [guid] {string} User guid
 * @param socket {WebSocket} Client socket to send messages
 * @param socket.sendAfterLogout {function} Send all messages after user logout
 * @returns {{status: number, [guid]: string, [message]: string}}
 */
const loginUser = (username, guid, socket) => {
    if (users[username]) {
        // User offline
        if (!users[username].isOnline) {
            if (users[username].guid === guid) {
                // Same user
                users[username].isOnline = true;
                usersOnline.push(username);
                socket.sendAfterLogout(users[username].logoutTime);
                return {
                    status: 0,
                    guid: users[username].guid
                }
            } else {
                // Another user
                return {
                    status: 1,
                    message: 'Wrong GUID for user'
                }
            }
        } else {
            return {
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
        return {
            status: 0,
            guid: users[username].guid
        };
    }
};

/**
 * Action on user logging out.
 * Set logout time for
 * @param username {string}
 */
const logoutUser = username => {
    if (!username) return;
    users[username] = Object.assign(users[username], {
        logoutTime: Date.now(),
        isOnline: false
    });
    usersOnline.splice(usersOnline.indexOf(username), 1);
    sendMessage({text: 'User ' + username + ' disconnected'});
};

const log = msg => {
    console.log((typeof msg !== 'string') ? JSON.stringify(msg) : msg);
};

log('server started');
