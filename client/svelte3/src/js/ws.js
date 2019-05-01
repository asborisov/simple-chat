"use strict";
const WebSocket = window.WebSocket;

let socket = null;
let queue = [];

const createSocket = (store, onConnectionClosed) => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = event => {
        try {
            const payload = JSON.parse(event.data);
            store.dispatch(payload);
        } catch (ex) {
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
        store.dispatch({type: 'logout'});
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
