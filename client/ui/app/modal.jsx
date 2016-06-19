/**
 * Created by mahmoudawadeen on 6/18/16.
 */
import Modal from 'react-modal';
import React from 'react';
import { render } from 'react-dom';
import Toggle from 'cf-component-toggle';
import Input from 'cf-component-input';
import {composer,loader} from '/client/main.jsx';
import {composeWithTracker} from 'react-komposer';
import { withRouter } from 'react-router';
import {Settings} from '/client/main.jsx';
import {customStyles} from '/client/ui/app/app.jsx'


export default class SettingModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            toggleValue: this.props.settings[1].value,
            password: CryptoJS.AES.decrypt(this.props.settings[2].value,this.props.settings[0].value).toString(CryptoJS.enc.Utf8)
        };

        this.openModal = ()=> {
            this.setState({modalIsOpen: true});
        };
        this.closeModal = ()=> {
            this.setState({modalIsOpen: false});
            const pass = CryptoJS.AES.encrypt(this.state.password, this.props.settings[0].value);
            Settings.update({_id: 'password'}, {
                $set: {
                    "value": pass.toString()
                }
            });
            Settings.update({_id: 'isPrivate'}, {
                $set: {
                    "value": this.state.toggleValue
                }
            });
        };
        this.handleToggle = value => {
            this.setState({
                toggleValue: value
            });
        };
        this.handelPasswordChange = password => {
            this.setState({password});
        };
        this.componentDidMount = ()=> {
            $(document).on("mousedown", ".input-wrapper button", (e)=> {
                $("input[name=password]").attr("type", "text");
            }).on("mouseup", ".input-wrapper button", (e)=> {
                $("input[name=password]").attr("type", "password");
            });

        }
    }

    render() {
        var input;
        var button;
        if (this.state.toggleValue)
            input = <div className="input-wrapper">
                <Input name="password" type="password"
                       value={this.state.password}
                       onChange={this.handelPasswordChange}/>
                <button >show</button>
            </div>;
        return (
            <div>
                <button onClick={this.openModal} className="modal-button">Privacy Settings</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}>
                    <div className="header-wrapper">
                        <h2>Landing Page Privacy Setting</h2>
                        <p>close this modal to save</p>
                    </div>
                    <Toggle
                        label="Example Toggle"
                        name="example"
                        value={this.state.toggleValue}
                        onChange={this.handleToggle}/>
                    {input}
                    <span className="close"><button onClick={this.closeModal}>X</button></span>
                </Modal>
            </div>)
    }
}


