<script>
	import { createEventDispatcher } from 'svelte';
	import Messages from "./Messages.svelte";
	import Users from "./Users.svelte";

	export let users;
	export let messages;
	const dispatch = createEventDispatcher();

	let text = "";

	function send() {
		dispatch("send", text);
		text = "";
	}
	function setValue({ target }) {
		text = target.value;
	}
	function inputKeyDown({ ctrlKey, keyCode }) {
		if (!ctrlKey || keyCode !== 13) return;
		send();
	}
</script>

<div class="wrapper">
    <div class="chat">
    	<Users users={users} />
		<Messages messages={messages} />
    </div>
    <div class="textArea">
        <textarea rows="4" class="input" value="{text}" on:input={setValue} on:keydown={inputKeyDown}></textarea>
        <input type="button" class="send" on:click={send} value="Send" />
    </div>
</div>

<style>
    .wrapper {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }
    .chat {
        display: flex;
        flex-direction: row;
        height: 90vh;
    }
    .textArea {
        height: 10vh;
        margin: 1vh 5vw;
    }

    .input {
    	width: 85%;
    }

    .send {
    	width: 10%;
    }
</style>