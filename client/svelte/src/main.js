import App from './components/App.svelte';

const app = new App({
    target: document.getElementById("root"),
    data: {
        name: 'world'
    }
});

window.app = app;

export default app;