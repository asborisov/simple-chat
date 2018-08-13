import { Store } from "svelte/store";
import { init as initWs, send as sendWs } from "./ws";
import { save as saveLs, load as loadLs } from "./localStorage";

const defaultState = {
    username: null,
    loginError: null,
    guid: null,
    messages: [],
    users: []
};

export class ChatStore extends Store {
    constructor() {
        super(defaultState);
        initWs({
            dispatch: (action) => {
                switch (action.type) {
                    case "login": {
                        if (action.status === "ok") {
                            const userData = {username: action.username, guid: action.guid};
                            saveLs(userData);
                            this.set(Object.assign({}, userData, {
                                loginError: null
                            }));
                        } else {
                            this.set({
                                loginError: action.message,
                            })
                        }
                    }
                }
            }
        });

        const localData = loadLs();
        if (localData) {
            this.login(localData.username, localData.guid);
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
}
