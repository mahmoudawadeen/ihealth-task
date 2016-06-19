import { Meteor } from 'meteor/meteor';
import React from 'react';
import { renderRoutes } from '/client/lib/routes';
import { render } from 'react-dom'
import ReactModal2 from 'react-modal2';
export const Settings = new Meteor.Collection('settings');


Meteor.startup(() => {
    const target = document.getElementById('cf-component-form--basic');
    ReactModal2.getApplicationElement = () => target;
    render(renderRoutes(), target);
});


export function composer(props, onData) {
    const handle = Meteor.subscribe('userData');
    if (handle.ready()) {
        const data = [Meteor.user(), Settings.find({}).fetch()];
        onData(null, {data});
    }
}
export const loader = ()=> (<div className="sk-folding-cube">
    <div className="sk-cube1 sk-cube"></div>
    <div className="sk-cube2 sk-cube"></div>
    <div className="sk-cube4 sk-cube"></div>
    <div className="sk-cube3 sk-cube"></div>
</div>);
