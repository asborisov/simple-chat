import { ChatStore } from './store';
import App from '../components/App.svelte';

export const app = new App({
    target: document.getElementById("root"),
    store: new ChatStore(),
});
