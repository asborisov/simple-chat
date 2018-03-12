import './main.css';
import { Main } from './Main.elm';
import localStoragePorts from 'elm-local-storage-ports/lib/js/local-storage-ports';
import registerServiceWorker from './registerServiceWorker';

const app = Main.embed(document.getElementById('root'));
localStoragePorts.register(app.ports);

registerServiceWorker();