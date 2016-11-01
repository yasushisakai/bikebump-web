import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login-component';
import { Router } from 'react-router'

class Login extends Component {
    responseGoogle (googleUser) {

        var id_token = googleUser.getAuthResponse().id_token;
        console.log({accessToken: id_token});
        Router.transitionTo('/');
        //anything else you want to do(save to localStorage)...
    }

    render () {
        return (
            <div>
            <GoogleLogin socialId="928066338514-fbonqdr8hqvfufh4hvp6ru66hq93c95s.apps.googleusercontent.com"
            class="google-login"
            scope="profile"
            responseHandler={this.responseGoogle}
            buttonText="Login With Google"/>
            </div>
    );
    }
}

export default Login;
