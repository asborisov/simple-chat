import {createStore} from 'redux';
import {save} from './localStorage';
import {send} from "./websocketService";

const defaultState = {
    username: null,
    loginError: null,
    guid: null,
    messages: [],
    users: []
};

/**
 *
 * @param state
 * @param action {{type: string, payload: {}}}
 * @returns {*}
 */
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'SEND_LOGIN':
            if (!action.payload.username) {
                return Object.assign({}, state, {
                    loginError: 'Wrong login!'
                });
            }
            send({type: 'login', username: action.payload.username, guid: action.payload.guid});
            return state;
        case 'USER_LOGIN':
            const userData = {username: action.payload.username, guid: action.payload.guid};
            save(userData);
            return Object.assign({}, state, userData, {
                loginError: null
            });
        case 'GET_MESSAGE':
            return Object.assign({}, state, {
                messages: [
                    ...state.messages,
                    {
                        uid: action.payload.uid,
                        text: action.payload.text,
                        author: action.payload.author,
                        date: new Date(action.payload.ts)
                    }
                ]
            });
        case 'SEND_MESSAGE':
            send({type: 'message', text: action.payload.text});
            return state;
        case 'GET_USERS':
            return Object.assign({}, state, {
                users: action.payload.list
            });
        case 'USER_LOGOUT':
            return defaultState;
        default:
            return state;
    }
};

export const init = () => createStore(reducer);