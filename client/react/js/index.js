import {init as initStorage} from './services/storage';
import {init as initWebSocket} from "./services/websocketService";
import {init as initApp} from './react/entry';

const storage = initStorage();
initWebSocket(storage);
initApp(storage);
