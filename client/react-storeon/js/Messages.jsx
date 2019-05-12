import React from 'react';
import PropTypes from 'prop-types';

const messagePropTypes = {
    uid: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.instanceOf(Date)
};
const formatNumber = input => `${input < 10 ? "0" : ""}${input}`;
const formatDate = date => formatNumber(date.getDate()) + '.' + formatNumber(date.getMonth()) +
        '.' + formatNumber(date.getFullYear()) + ' ' + formatNumber(date.getHours()) +
        ':' + formatNumber(date.getMinutes()) + ':' + formatNumber(date.getSeconds());

const Message = props =>
    <div style={{display: "block" }}>
        <span style={{ color: "dimgray" }}>{`${props.author} [${formatDate(props.date)}]`}</span>
        {`${props.author && ':'} ${props.text}`}
    </div>;
Message.propTypes = messagePropTypes;

const Messages = props => <div style={props.style}>
    {props.messages.map(m => <Message key={m.uid} {...m} />)}
</div>;
Messages.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape(messagePropTypes)
    )
};

export {Messages}
