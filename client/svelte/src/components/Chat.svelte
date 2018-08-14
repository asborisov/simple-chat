<div class="wrapper">
    <div class="chat">
        <Users users="{$users}" />
        <Messages messages="{$messages}" />
    </div>
    <div class="input">
        <input
            type="text"
            on:keyDown="inputKeyDown(event)"
            on:change="textChange(event.target.value)"
            value="{text}"
        />
        <input type="button" on:click="send()" value="Send" />
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
    .input {
        height: 10vh;
    }
</style>

<script>
    export default {
        immutable: true,
        data() {
            return {
                text: ""
            };
        },
        components: {
            Users: "./Users.svelte",
            Messages: "./Messages.svelte",
        },
        methods: {
            inputKeyDown(event) {
                if (!event.ctrlKey || event.keyCode !== 13) return;
                this.send();
            },
            textChange(text) {
                this.set({ text });
            },
            send() {
                this.store.sendMessage(this.get().text);
                this.textChange('');
            }
        }
    }
</script>