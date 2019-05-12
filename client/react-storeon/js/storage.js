import createStoreon from "storeon";
import {save} from "./localStorage";
import {send} from "./websocket";

const users = store => {
  store.on("@init", () => ({ users: [] }));
  store.on("users/set", ({ users }, { list }) => ({
    users: list,
  }));
}

const messages = store => {
  store.on("@init", () => ({ messages: [] }));
  store.on("messages/add", ({ messages }, message) => ({
    messages: [
      ...messages,
      {
        uid: message.uid,
        text: message.text,
        author: message.author,
        date: new Date(message.ts), 
      }
    ]
  }));
  store.on("messages/send", (_, { text }) => {
    send({type: 'message', text});
  });
}

const user = store => {
  const initial = {
    username: null,
    loginError: null,
    guid: null,
  };
  store.on("@init", () => initial);
  store.on("user/logout", () => initial);
  store.on("user/login", (_, { username, guid }) => {
    if (!username) {
      return { loginError: 'Wrong login!' };
    }
    send({ type: "login", username, guid });
  })
  store.on("user/loggedIn", (_, { username, guid }) => {
    save({ username, guid });
    return {
      username,
      guid,
      loginError: null,
    };
  });
}

export const createStore = () => createStoreon([ user, users, messages ]);
