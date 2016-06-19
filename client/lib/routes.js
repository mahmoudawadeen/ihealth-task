import React from 'react'
import { render } from 'react-dom'
import  Login  from '/client/ui/login/login.jsx'
import Profile from '/client/ui/profile/profile.jsx'
import App from '/client/ui/app/app.jsx'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

function requireAuth(nextState, replace) {
    if (!Meteor.userId())
        replace({
            pathname: '/login',
            state: {nextPathname: nextState.location.pathname}
        })
}
function handleOnLogin(nextState, replace) {
    if (Meteor.userId()) {
        replace({
            pathname: '/',
            state: {nextPathname: nextState.location.pathname}
        })
    }
}
export const renderRoutes = () => (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="login" component={Login} onEnter={handleOnLogin}/>
            <Route path="profile" component={Profile} onEnter={requireAuth}/>
        </Route>
    </Router>
);