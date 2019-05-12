import React, { useState } from "react";
import useStoreon from "storeon/react";
import { Users } from "./Users";
import { Messages } from "./Messages";

const Chat = () => {
	const [state, setState] = useState("");
	const { dispatch, users, messages } = useStoreon("users", "messages");
	const sendMessage = () => {
		dispatch("messages/send", { text: state });
        setState("");
	}
	const onKeyDown = ({ ctrlKey, keyCode }) => {
        if (!ctrlKey || keyCode !== 13) return;
        sendMessage(state);
	}
	const onInput = e => setState(e.target.value);

	return <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{display: 'flex', flexDirection: 'row', height: '90vh'}} key="chat">
            <Users key="users" style={{width: '20vw'}} users={users} />
            <Messages key="messages" style={{width: '80vw'}} messages={messages} />
        </div>
        <div key="input" style={{ height: "10vh", margin: "1vh 5vw"}}>
            <textarea rows="4" style={{ width: "85%" }} onKeyDown={onKeyDown} onChange={onInput} value={state}></textarea>
            <input type="button" style={{ width: "10%" }} onClick={sendMessage} value="Send"/>
        </div>
	</div>
}
