<div class="messages">
    {#each messages as message (message.uid)}
    <Message message="{message}" />
    {/each}
</div>

<style>
    .messages {
        width: 80vw;
    }
</style>

<script>
    export default {
        immutable: true,
        components: {
            Message: "./Message.svelte"
        }
    }
</script>
