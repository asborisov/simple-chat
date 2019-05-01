import { ChatStore } from './js/store';
import App from './components/App.svelte';

const app = new App({
	target: document.body,
	props: {
	    store: (new ChatStore()),
	},
});

export default app;