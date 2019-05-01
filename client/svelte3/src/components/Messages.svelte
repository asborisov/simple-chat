<script>
    import Message from "./Message.svelte";

    export let messages;
</script>

<style>
    .messages {
        width: 80vw;
    }
</style>

<div class="messages">
    {#each messages as message (message.uid)}
    <Message message={message} />
    {/each}
</div>

