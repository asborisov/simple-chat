import { writable } from "svelte/store";
import { init as initWs, send as sendWs } from "./ws";
import { save as saveLs, load as loadLs } from "./localStorage";

const defaultState = {
    username: null,
    loginError: null,
    guid: null,
    messages: [],
    users: [],
    inputText: '',
};

export class ChatStore {
    constructor() {
        this.store = writable(defaultState);

        initWs({
            dispatch: this.messageHandler.bind(this),
        });

        const localData = loadLs();
        if (localData) {
            this.login(localData.username, localData.guid);
        }
    }
    messageHandler(message) {
        switch (message.type) {
            case "login":
                if (message.status === "ok") {
                    const userData = {username: message.username, guid: message.guid};
                    saveLs(userData);
                    this.store.update(data => Object.assign({}, data, userData, {
                        loginError: null
                    }));
                } else {
                    this.store.update(data => ({
                        ...data,
                        loginError: message.message,
                    }))
                }
                break;
            case "usersList":
                this.store.update(data => ({
                    ...data,
                    users: message.list,
                }));
                break;
            case "message":
                this.store.update(data => ({
                    ...data,
                    messages: [
                        ...data.messages,
                        {
                            uid: message.uid,
                            text: message.text,
                            author: message.author,
                            date: new Date(message.ts)
                        }
                    ]
                }));
                break;
            case "logout":
                this.store.set(defaultState);
                break;
            default:
                break;
        }
    }
    login(username, guid = null) {
        if (!username) {
            this.store.update(data => ({
                ...data,
                loginError: 'Wrong login!',
            }));
        }
        sendWs({ type: "login", username: username, guid: guid});
    }
    sendMessage(text) {
        if (!text) return;
        sendWs({ type: 'message', text });
    }
    getStore() {
        return this.store;
    }
}
