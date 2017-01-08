/**
 * bikebump
 * GoogleLogin.jsx
 * by collin
 * 10/13/16
 */

import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login-component';
import Config from '../settings/config';
import axios from 'axios';



/**
 * Login class
 */
class Login extends Component {

    responseGoogle(googleUser) {

        let config = new Config(window);

        var access_token = googleUser.getAuthResponse().access_token;

        // server handles
        /**
         * samele url
         * ../api/users/verify?atok=ya29.CjCnA7yRa2ge1JynEFU5f0TyummShXoObOiiYmaoZudH1QTcBnAhrOsC0L892GWySZY
         */
        let promises = [];

        axios.get(config.api_root+'users/verify?atok='+access_token).then((response) => {
            console.log(response);
            promises.push(localStorage.username = response.data.username);
            promises.push(localStorage.id = response.data.id);
            promises.push(localStorage.fences = JSON.stringify(response.data.fences));
            Promise.all(promises).then(window.location="app")});
    }


    render() {
        return (
            <div>
                <GoogleLogin socialId="928066338514-fbonqdr8hqvfufh4hvp6ru66hq93c95s.apps.googleusercontent.com"
                             class="google-login"
                             scope="profile"
                             responseHandler={this.responseGoogle}
                             buttonText="Login With Google"
                             />
            </div>
        )
    }
};

export default Login;

