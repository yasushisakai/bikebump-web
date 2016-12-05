/**
 * bikebump
 * GoogleLogin.jsx
 * by collin
 * 10/13/16
 */

import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login-component';
import { Router, Link , browserHistory} from 'react-router';
import Config from '../settings/config';
import axios from 'axios';



/**
 * Login class
 */
class Login extends Component {

    responseGoogle(googleUser) {

        let config = new Config(window);

        var access_token = googleUser.getAuthResponse().access_token;
        localStorage.token = access_token;

        // server handles
        /**
         * samele url
         * ../api/users/verify?atok=ya29.CjCnA7yRa2ge1JynEFU5f0TyummShXoObOiiYmaoZudH1QTcBnAhrOsC0L892GWySZY
         */
        axios.get(config.api_root+'users/verify?atok='+access_token);

        window.location="app";
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

