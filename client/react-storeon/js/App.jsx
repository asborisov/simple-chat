import React, { useEffect } from "react";
import useStoreon from "storeon/react";
import { load } from "./localStorage";
import { Login } from "./Login";
import { Chat } from "./Chat";

export const App = () => {
	const { dispatch, username } = useStoreon("username");
	useEffect(() => {
        const localData = load();
        if (localData) {
            dispatch("user/login", localData);
        }
	}, []);

	return username ? <Chat /> : <Login />;
}
