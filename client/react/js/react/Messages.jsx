import React from 'react';
import PropTypes from 'prop-types';

const Message = (props) => {
    return (
        <span style={{display: 'block'}}>
            <b>{props.author}</b>
            {`${props.author && ': '}${props.text}`}
        </span>
    );
};
const messagePropTypes = {
    uid: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.instanceOf(Date)
};
Message.propTypes = messagePropTypes;

const Messages = (props) => {
    const messages = props.messages.map(m => <Message key={m.uid} {...m} />);
    return <div style={props.style}>{messages}</div>;
};
Messages.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape(Message.propTypes)
    )
};

export {Messages}
