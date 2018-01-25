import React from 'react';
import PropTypes from 'prop-types';

const messagePropTypes = {
    uid: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.instanceOf(Date)
};
const formatDate = date => ``;
const Message = (props) => {
    return (
        <div style={{display: 'block'}}>
            <span>{`${props.author} [${formatDate(props.date)}]`}</span>
            {`${props.author && ': '}${props.text}`}
        </div>
    );
};
Message.propTypes = messagePropTypes;

const Messages = (props) => {
    const messages = props.messages.map(m => <Message key={m.uid} {...m} />);
    return <div style={props.style}>{messages}</div>;
};
Messages.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape(messagePropTypes)
    )
};

export {Messages}
