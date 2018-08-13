<Login on:submit="onLoginSubmit(event)"></Login>

<script>
    export default {
        immutable: true,
        components: {
            Login: "./Login.svelte",
            Chat: "./Chat.svelte"
        },
        methods: {
            onLoginSubmit(event) {
                event.preventDefault();
                const username = event.target.querySelector('[type="text"]').value;
                this.store.login(username);
            }
        }
    }
</script>