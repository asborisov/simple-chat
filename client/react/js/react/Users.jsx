import React from 'react';
import PropTypes from 'prop-types';

const Users = (props) => {
    const users = props.users.map(u => <div key={u}>{u}</div>);
    return <div style={props.style}>{users}</div>;
};
Users.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.string()
    )
};

export {Users}
