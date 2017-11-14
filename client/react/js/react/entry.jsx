import React from 'react';
import ReactDom from 'react-dom';

import {ChatApp} from './ChatApp';

const init = (storage) => {
    ReactDom.render(<ChatApp storage={storage}/>, document.getElementById('chat-app'));
};

export { init }
