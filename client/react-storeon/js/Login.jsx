import React from "react";
import useStoreon from "storeon/react";

export const Login = () => {
	const { dispatch, loginError } = useStoreon("loginError");
	const login = e => {
        e.preventDefault();
        dispatch("user/login", { username: e.target.querySelector('[type="text"]').value });
    }
	return <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
    }}>
        <form onSubmit={login}>
            <input type="text" placeholder="Enter you login"/>
            <input type="submit" value="Enter"/>
        </form>
        <div style={{color: 'red'}}>{loginError}</div>
    </div>
}
