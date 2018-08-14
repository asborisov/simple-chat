import { Store } from "svelte/store";
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

export class ChatStore extends Store {
    constructor() {
        super(defaultState);

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
                    this.set(Object.assign({}, userData, {
                        loginError: null
                    }));
                } else {
                    this.set({
                        loginError: message.message,
                    })
                }
                break;
            case "usersList":
                this.set({
                    users: message.list,
                });
                break;
            case "message":
                this.set({
                    messages: [
                        ...this.get().messages,
                        {
                            uid: message.uid,
                            text: message.text,
                            author: message.author,
                            date: new Date(message.ts)
                        }
                    ]
                });
                break;
            case "logout":
                this.set(defaultState);
                break;
            default:
                break;
        }
    }
    login(username, guid = null) {
        if (!username) {
            this.set({
                loginError: 'Wrong login!',
            });
        }
        sendWs({ type: "login", username: username, guid: guid});
    }
    sendMessage(text) {
        if (!text) return;
        sendWs({ type: 'message', text });
    }
}
