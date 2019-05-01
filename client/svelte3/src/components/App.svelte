<script>
	import Login from "./Login.svelte";
	import Chat from "./Chat.svelte";

	export let store;
	let state;

	function onLoginSubmimt({ detail }) {
        store.login(detail);
	}

	function sendMessage({ detail }) {
		store.sendMessage(detail);
	}

	store.getStore().subscribe(value => {
		state = value;
	})
</script>

<style>
	:global(body) {
		margin: 0;
	}
</style>

{#if !state.guid}
<Login loginError={state.loginError} on:submit={onLoginSubmimt} />
{:else}
<Chat users={state.users} messages={state.messages} on:send={sendMessage} />
{/if}