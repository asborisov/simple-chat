<script>
	import { createEventDispatcher } from 'svelte';

	export let loginError;
	const dispatch = createEventDispatcher();

	function submit(event) {
		dispatch('submit', event.target.querySelector('[type="text"]').value);
	}
</script>

<style>
    .login {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }
    .login .error {
        color: red;
    }
</style>

<div class="login">
    <form on:submit|preventDefault={submit}>
        <input type="text" placeholder="Enter you login"/>
        <input type="submit" value="Enter"/>
    </form>
    {#if loginError}
    <div class="error">{loginError}</div>
    {/if}
</div>
