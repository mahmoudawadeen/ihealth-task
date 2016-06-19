/**
 * Created by mahmoudawadeen on 6/15/16.
 */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import React from 'react';
import { withRouter, Link } from 'react-router';
import { render } from 'react-dom';
import  Input  from 'cf-component-input';
import Text from 'cf-component-text';
import {Button} from 'cf-component-button';
import {composer,loader} from '/client/main.jsx';
import {composeWithTracker} from 'react-komposer';
import Modal from 'react-modal';
import {
    NotificationList,
    Notification,
    NotificationGlobalContainer
} from 'cf-component-notifications';
import SettingModal from './modal.jsx';

let UNIQUE_ID = 0;
var target;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            modalIsOpen: false,
            password: ''
        };
        this.handleAdd = (type, persist, delay, message) => {
            const id = UNIQUE_ID++;
            this.setState({
                notifications: this.state.notifications.concat({
                    id: id,
                    type: type,
                    message: message,
                    persist: persist,
                    delay: delay
                })
            });
        };

        this.handleClear = () => {
            this.setState({
                notifications: []
            });
        };

        this.handleClose = id => {
            this.setState({
                notifications: this.state.notifications.filter(n => n.id !== id)
            });
            this.props.router.push(this.props.location.pathname);
        };
        this.handelLoginLogoutLink = (event) => {
            event.preventDefault();
            var self = this;
            if (event.currentTarget.text != 'Profile')
                self.handleClear();
            if (event.currentTarget.text == 'Logout') {
                Meteor.logout(function () {
                    Session.set('authorized', false);
                    self.props.router.push('/');
                })
            } else {
                this.props.router.push($(event.currentTarget).attr('href'));
            }
        };
        this.handleSubmit = (event) => {
            var password = this.state.password;
            if (CryptoJS.AES.decrypt(this.props.data[1][2].value, this.props.data[1][0].value).toString(CryptoJS.enc.Utf8)
                == password.toString()) {
                Session.set('authorized', true);
                this.setState({password: ''});
            }else{
                alert('incorrect password');
            }
        };
        this.handelPasswordChange = password => {
            this.setState({password});
        };
        this.componentWillMount = () => {
            this.setAuthorized(this.props);
        };
        this.componentWillUpdate = (nextProps, nextState) => {
            this.setAuthorized(nextProps);
        };
        this.setAuthorized = (props) => {
            Session.setDefault('authorized', false);
            if (!Session.get('authorized'))
                Session.set('authorized', !props.data[1][1].value
                    || (props.data[0] && props.data[0].profile.isAdmin));
        }

    }

    render() {
        var output;
        var links;
        var modal;
        var home_item = <li><Link onClick={this.handelLoginLogoutLink} activeClassName="active" to="/">Home</Link></li>;
        var profile_item = <li><Link onClick={this.handelLoginLogoutLink} activeClassName="active"
                                     to="profile">Profile</Link></li>;
        if (this.props.data[0]) {
            if (this.props.data[0].profile.isAdmin  && this.props.location.pathname=='/')
                modal = <SettingModal settings={this.props.data[1]}/>;
            links =
                <ul>
                    {home_item}
                    {profile_item}
                    <li><Link onClick={this.handelLoginLogoutLink} activeClassName="active"
                              to="logout">Logout</Link></li>
                </ul>
        } else {
            links =
                <ul>
                    {home_item}
                    <li><Link onClick={this.handelLoginLogoutLink} activeClassName="active"
                              to="login">Login</Link></li>
                </ul>

        }
        var nav =
            <div className="container">
                <nav className="nav-wrapper">
                    {links}
                    <hr/>
                </nav>
            </div>;
        if (this.props.location.pathname != '/' || Session.get('authorized')) {
            var welcome;
            if (this.props.location.pathname == '/')
                welcome =
                    <div className="header-wrapper"><h1 className="welcome-message">Welcome to the landing page</h1>
                    </div>;
            const notifications = this.state.notifications.map(n => {
                return <Notification
                    key={n.id}
                    type={n.type}
                    message={n.message}
                    persist={n.persist}
                    delay={n.delay}
                    onClose={this.handleClose.bind(null, n.id)}/>
            }).reverse();
            const childrenWithProps = React.Children.map(this.props.children,
                (child) => React.cloneElement(child, {
                    addNotification: this.handleAdd,
                    user: this.props.data[0],
                    settings: this.props.data[1]
                })
            );
            output = <div>
                <NotificationGlobalContainer>
                    <NotificationList>
                        {notifications}
                    </NotificationList>
                </NotificationGlobalContainer>
                {nav}
                {welcome}
                {childrenWithProps}
                {modal}
            </div>
        } else
            output = <Modal
                isOpen={true}
                style={customStyles}>
                {nav}
                <Text size="normal">Please enter password to access this page</Text>
                <Input name="password" type="password"
                       value={this.state.password}
                       onChange={this.handelPasswordChange}/>
                <Button submit type="primary" onClick={this.handleSubmit}>
                    Submit
                </Button>
            </Modal>;
        return (output)
    }
}
export const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: "50%",
        "textAlign": "center"

    }
};

export default composeWithTracker(composer, loader)(withRouter(App));
