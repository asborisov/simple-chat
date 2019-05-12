import React from "react";
import ReactDOM from "react-dom";
import StoreContext from "storeon/react/context";

import { createStore } from "./js/storage";
import { init } from "./js/websocket";
import { App } from "./js/App";

const store = createStore();
init(store);
var mountNode = document.getElementById("app");
ReactDOM.render(
	<StoreContext.Provider value={store}><App /></StoreContext.Provider>,
	mountNode
);