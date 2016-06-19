/**
 * Created by mahmoudawadeen on 6/15/16.
 */
/**
 * Created by mahmoudawadeen on 6/14/16.
 */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withRouter } from 'react-router';
import { render } from 'react-dom';
import  Textarea from 'cf-component-textarea';
import {  FlexItem, Flex  } from 'cf-component-flex';
import  Input  from 'cf-component-input';
import  {Button}  from 'cf-component-button';
import Link from 'cf-component-link';
import App from '/client/ui/app/app.jsx';
import Toggle from 'cf-component-toggle';
import {
    Form,
    FormHeader,
    FormFooter,
    FormFieldset,
    FormLabel,
    FormFieldError
} from 'cf-component-form'
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirm_password: '',
            action: true
        };
        this.handelEmailChange = email => {
            this.setState({email});
        };

        this.handelPasswordChange = password => {
            this.setState({password});
        };
        this.handelConfirmPasswordChange = confirm_password => {
            this.setState({confirm_password});
        };
        this.handelRegisterLoginLink = (value) => {
            if (value) {
                $('input[name=confirm-password]').parent().hide();
            } else {
                $('input[name=confirm-password]').parent().show();
            }
            this.setState({action: value});
        };
        this.handleSubmit = (event) => {
            var self = this;
            event.preventDefault();
            var email = this.state.email
                , password = this.state.password, confirm_password = this.state.confirm_password;
            if (!this.state.action) {
                if (password == confirm_password) {
                    Accounts.createUser({
                        email: email,
                        password: password,
                        bio: '',
                        facebook_link: '',
                        linkedin_link: '',
                        status: ''
                    }, function (err) {
                        if (err) {
                            alert(err);
                        } else {
                            self.props.router.push({
                                pathname: '/profile',
                                state: {type: 'success', persist: false, delay: 4000, message: 'Congratulations'}
                            });
                        }
                    });
                } else
                    alert("passwords don't match");
            } else {
                Meteor.loginWithPassword(email, password, function (err) {
                    if (err)
                        alert('failed login');
                    else {
                        self.props.router.push({
                            pathname: '/profile',
                            state: {type: 'success', persist: false, delay: 4000, message: 'Welcome back'}
                        });
                    }
                });
            }
        };
        this.componentDidMount = () => {
            $('input[name=confirm-password]').parent().hide();
        }
    };

    render() {
        var legend = <div className="toggle-legend"><Toggle
            label="Example Toggle"
            name="example"
            value={this.state.action}
            onChange={this.handelRegisterLoginLink}/></div>;


        return (
            <div className="login-form-wrapper">
                <Form layout="horizontal" onSubmit={this.handleSubmit}>
                    <FormFieldset legend={legend}>
                        <Flex spacing="wide">
                            <FlexItem>
                                <FormLabel className = "form">Email</FormLabel>
                                <Input name="email" type="email"
                                       value={this.state.email}
                                       onChange={this.handelEmailChange}
                                       id="hey"/>
                            </FlexItem>

                            <FlexItem>
                                <FormLabel>Password</FormLabel>
                                <Input name="password" type="password"
                                       value={this.state.password}
                                       onChange={this.handelPasswordChange}
                                />
                            </FlexItem>
                            <FlexItem collapse={true}>
                                <FormLabel>Confirm Password</FormLabel>
                                <Input name="confirm-password" type="password"
                                       value={this.state.confirm_password}
                                       onChange={this.handelConfirmPasswordChange}
                                />
                            </FlexItem>
                        </Flex>
                    </FormFieldset>
                    <FormFooter>
                        <Button submit type="primary" onClick={this.handleSubmit}>
                            Submit
                        </Button>
                    </FormFooter>
                </Form>
            </div>
        );
    }
}
export default withRouter(Login);