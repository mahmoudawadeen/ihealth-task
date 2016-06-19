/**
 * Created by mahmoudawadeen on 6/15/16.
 */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import React from 'react';
import { withRouter } from 'react-router';
import { render } from 'react-dom';
import { Card,
    CardContent,
    CardLoadingText,
    CardControl,
    CardSection} from 'cf-component-card'
import Input from 'cf-component-input'
import {Button} from 'cf-component-button'
import Textarea from 'cf-component-textarea'
import {composer,loader} from '/client/main.jsx';
import {composeWithTracker} from 'react-komposer';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            facebook_input: this.props.user.profile.facebook_link,
            linkedin_input: this.props.user.profile.linkedin_link,
            bio_textArea: this.props.user.profile.bio,
            status_textArea: this.props.user.profile.status,
            disabled: true
        };
        this.toggleEdit = (event) => {
            this.setState({disabled: !this.state.disabled});
            $("input[name$=input]").prop('disabled', !this.state.disabled);
            if (!this.state.disabled) {
                event.currentTarget.textContent = 'Edit';
                Meteor.users.update({_id: Meteor.userId()}, {
                    $set: {
                        "profile.bio": this.state.bio_textArea,
                        "profile.status": this.state.status_textArea,
                        "profile.facebook_link": this.state.facebook_input,
                        "profile.linkedin_link": this.state.linkedin_input
                    }
                });
            } else
                event.currentTarget.textContent = 'Save';
        };
        this.handleChange_facebook = value => {
            this.setState({
                facebook_input: value
            });
        };
        this.handleChange_linkedin = value => {
            this.setState({
                linkedin_input: value
            });
        };
        this.handleChange_bio = value => {
            this.setState({
                bio_textArea: value
            });
        };
        this.handleChange_status = value => {
            this.setState({
                status_textArea: value
            });
        };
        this.componentWillMount = () => {
            if (this.props.location.state) {
                this.props.addNotification(this.props.location.state.type,
                    this.props.location.state.persist, this.props.location.state.delay, this.props.location.state.message);
            }
        };
        this.componentDidMount = () => {
            $("input[name$=input]").prop('disabled', this.state.disabled);
        };
    }

    render() {
        return (
            <div className="container profile-wrapper">
                <Card>
                    <CardSection>
                        <CardControl>
                            <button className="modal-button" onClick={this.toggleEdit}>Edit</button>
                        </CardControl>
                        <CardContent title="Profile">
                            <div className="textAreas-wrapper">
                                <label>Status</label>
                                <hr/>
                                <Textarea
                                    name="status_textArea"
                                    value={this.state.status_textArea}
                                    onChange={this.handleChange_status}
                                    onBlur={this.handleBlur}
                                    disabled={this.state.disabled}/>
                                <label>Bio</label>
                                <hr/>
                                <Textarea
                                    name="bio_textArea"
                                    value={this.state.bio_textArea}
                                    onChange={this.handleChange_bio}
                                    onBlur={this.handleBlur}
                                    disabled={this.state.disabled}/>
                            </div>
                            <div className="inputs-wrapper">
                                <div className="facebook-input-wrapper">
                                    <label>Facebook</label>
                                    <Input
                                        type="text"
                                        name="facebook_input"
                                        value={this.state.facebook_input}
                                        onChange={this.handleChange_facebook}
                                    />
                                </div>
                                <div>
                                    <label>Linkedin</label>
                                    <Input
                                        type="text"
                                        name="linkedin_input"
                                        value={this.state.linkedin_input}
                                        onChange={this.handleChange_linkedin}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </CardSection>
                </Card>
            </div>
        );
    }
}


export default (withRouter(Profile));