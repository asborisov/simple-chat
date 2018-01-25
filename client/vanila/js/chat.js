(function() {
    'use strict';
    // Check if browser have WebSocket support
    if (!window.WebSocket) {
        document.body.innerHTML = 'WebSocket is not supported by your browser';
    }

    /**
     * Connection to server
     * @type {WebSocket}
     */
    let socket;

    /**
     * Submit of login form. Login in
     * @returns {boolean}
     */
    document.forms.login.onsubmit = function() {
        sendLogin(this.login.value);
        return false;
    };

    /**
     * Submit of text area. Sending message
     * @returns {boolean}
     */
    document.forms.publish.onsubmit = function() {
        sendMessage(this.message.value);
        this.message.value = '';
        return false;
    };

    startConnection();

    function startConnection() {
        socket = new WebSocket("ws://localhost:3000");

        /**
         * Action on get message from server
         * @param event
         */
        socket.onmessage = function(event) {
            try {
                const msg = JSON.parse(event.data);
                // Check message type
                switch (msg.type) {
                    case 'login': {
                        getLogin(msg);
                        break;
                    }
                    case 'message': {
                        getMessage(msg.text, msg.author, msg.ts);
                        break;
                    }
                    case 'usersList': {
                        getUsersList(msg.list);
                        break;
                    }
                }
            } catch (ex) {
                // JSON parse error
                console.log(ex);
            }
        };

        /**
         * When connection established
         */
        socket.onopen = function() {
            const chatData = window.localStorage.getItem('chatData');
            if (!chatData) return;
            // Parsing data
            try {
                const parsedData = JSON.parse(chatData);
                sendLogin(parsedData.login, parsedData.guid);
            } catch (ex) {
                console.log(ex);
                // If we get parsing error - remove this `thing` from storage
                window.localStorage.removeItem('chatData');
            }
        };

        socket.onclose = function() {
            alert('Lost connection. Try to re-login');
            document.getElementById('publish').classList.add('hidden');
            document.getElementById('chat').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
            startConnection();
        };
    }

    /**
     * Attempt to login in
     * @param login {string} user login
     * @param [guid] {string} user guid
     */
    function sendLogin(login, guid) {
        if (!login) return;
        socket.send(JSON.stringify({
            type: 'login',
            guid: guid,
            username: login
        }));
    }
    /**
     * Send text message to server
     * @param text {string}
     */
    function sendMessage(text) {
        socket.send(JSON.stringify({
            type: 'message',
            text: text
        }));
    }

    /**
     * On get message with type 'login'
     * @param data {object} server message
     * @param data.status {string} request status [ok, error]
     * @param data.username {string} login of user (when status = ok)
     * @param data.guid {string} guid of user (when status = ok)
     * @param data.code {number} error code (when status = error)
     * @param data.message {string} error message (when status = error)
     */
    function getLogin(data) {
        if (data.status === 'ok') {
            window.localStorage.setItem('chatData', JSON.stringify({
                login: data.username,
                guid: data.guid
            }));
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('publish').classList.remove('hidden');
            document.getElementById('chat').classList.remove('hidden');
        } else {
            const errorMsg = document.getElementById('loginForm').getElementsByClassName('error')[0];
            // Clear all existing children
            while (errorMsg.firstChild) {
                errorMsg.removeChild(errorMsg.firstChild);
            }
            switch (data.code) {
                case 1: {
                    errorMsg.appendChild(document.createTextNode('Login is already in use. Try to use another.'));
                    break;
                }
                case 2: {
                    errorMsg.appendChild(document.createTextNode('User is already online.'));
                    break;
                }
            }
            window.localStorage.removeItem('chatData');
            console.log(data.code, data.message);
        }
    }
    /**
     * Display message
     * @param message {string} message text
     * @param [sender] {string} sender of message. undefined when service info (eg. user login/logout)
     * @param [timestamp] {number} Message timestamp
     */
    function getMessage(message, sender, timestamp) {
        if (sender && timestamp) {
            const date = new Date();
            date.setTime(timestamp);
            timestamp = castDateItem(date.getDate()) + '.' + castDateItem(date.getMonth()) +
                '.' + castDateItem(date.getFullYear()) + ' ' + castDateItem(date.getHours()) +
                ':' + castDateItem(date.getMinutes()) + ':' + castDateItem(date.getSeconds());
        }
        const messageElem = document.createElement('div');
        messageElem.classList.add('message');
        if (sender) {
            const senderDiv = document.createElement('div');
            senderDiv.classList.add('sender');
            senderDiv.appendChild(document.createTextNode(sender + (timestamp ? (' [' + timestamp + ']') : '') + ': '));
            messageElem.appendChild(senderDiv);
        }
        const messageDiv = document.createElement('div');
        messageDiv.innerText = message;
        messageElem.appendChild(messageDiv);
        document.getElementsByClassName('messages')[0].getElementsByClassName('list-wrapper')[0].appendChild(messageElem);
        scrollToBottom();

        /**
         * @param item {number}
         * @returns {string}
         */
        function castDateItem(item) {
            return item < 10 ? ('0' + item) : ('' + item);
        }

        function scrollToBottom() {
            const element = document.getElementsByClassName('messages')[0];
            element.scrollTop = element.scrollHeight;
        }
    }
    /**
     * Update list of users
     * @param list {Array} List of users names
     */
    function getUsersList(list) {
        const usersList = document.getElementsByClassName('users')[0].getElementsByClassName('list-wrapper')[0];
        while (usersList.firstChild) {
            usersList.removeChild(usersList.firstChild);
        }
        list.forEach(function(user) {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(user));
            div.classList.add('user');
            usersList.appendChild(div);
        });
    }
}());
