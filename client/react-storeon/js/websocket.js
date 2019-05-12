"use strict";
const WebSocket = window.WebSocket;

let socket = null;
let queue = [];

const createSocket = (storage, onConnectionClosed) => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = event => {
        try {
            const payload = JSON.parse(event.data);
            // Check message type
            switch (payload.type) {
                case 'login': {
                    storage.dispatch("user/loggedIn", payload);
                    break;
                }
                case 'message': {
                    storage.dispatch("messages/add", payload);
                    break;
                }
                case 'usersList': {
                    storage.dispatch("users/set", payload);
                    break;
                }
            }
        } catch (ex) {
            // JSON parse error
            console.error(ex);
        }
    };

    /**
     * When connection established
     */
    socket.onopen = () => {
        if (!queue.length) return;
        queue.forEach(send);
        queue = [];
    };

    socket.onclose = () => {
        alert('Lost connection. Try to re-login');
        storage.dispatch({type: 'USER_LOGOUT'});
        if (typeof onConnectionClosed === 'function') {
            onConnectionClosed();
        }
    };

    return socket;
};

const init = (storage) => {
    socket = createSocket(storage, () => init(storage));
};

const send = (msg) => {
    if (socket === null) return;
    if (socket.readyState === 1) {
        socket.send(JSON.stringify(msg));
        return;
    }
    queue.push(msg);
};

export {init, send};
