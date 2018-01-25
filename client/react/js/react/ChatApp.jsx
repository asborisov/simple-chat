import React from 'react';
import {load} from '../services/localStorage';

import {Messages} from "./Messages";
import {Users} from "./Users";

class ChatApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            loginError: null,
            inputValue: ''
        };

        props.storage.subscribe(() => {
            this.setState(props.storage.getState());
        });

        this.getContent = this.getContent.bind(this);
        this.login = this.login.bind(this);
        this.onInputChanged = this.onInputChanged.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        const localData = load();
        if (localData) {
            this.props.storage.dispatch({
                type: 'SEND_LOGIN',
                payload: localData
            })
        }
    }

    login(e) {
        e.preventDefault();
        const username = e.target.querySelector('[type="text"]').value;

        this.props.storage.dispatch({
            type: 'SEND_LOGIN',
            payload: {username}
        });
    }

    onInputChanged(e) {
        this.setState({inputValue: e.target.value});
    }

    submit(e) {
        switch (e.type) {
            case 'keydown':
                if (!e.ctrlKey || e.keyCode !== 13) return;
                break;
            case 'click':
                break;
            default:
                return;
        }
        this.props.storage.dispatch({
            type: 'SEND_MESSAGE',
            payload: {
                text: this.state.inputValue
            }
        });
        this.setState({inputValue: ''});
    }

    getContent() {
        if (!this.state.username) {
            return (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                }}>
                    <form onSubmit={this.login}>
                        <input type="text" placeholder="Enter you login"/>
                        <input type="submit" value="Enter"/>
                    </form>
                    <div style={{color: 'red'}}>{this.state.loginError}</div>
                </div>
            );
        }
        return [
            <div style={{display: 'flex', flexDirection: 'row', height: '90vh'}} key="chat">
                <Messages
                    key={'messages'}
                    style={{width: '80vw'}}
                    messages={this.state.messages}
                />
                <Users
                    key={'users'}
                    style={{width: '20vw'}}
                    users={this.state.users}
                />
            </div>,
            <div key="input" style={{height: '10vh'}}>
                <input
                    type="text"
                    onKeyDown={this.submit}
                    onChange={this.onInputChanged}
                    value={this.state.inputValue}/>
                <input type="button" onClick={this.submit} value="Send"/>
            </div>
        ];
    };

    render() {
        return <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column'}}>
            {this.getContent()}
        </div>;
    }
}

export {ChatApp};
