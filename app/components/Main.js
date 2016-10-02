// created at 2016.10.02
// by yasushisakai

import React, {PropTypes} from 'react'

//
// Main Stateless Function
//
export default function Main(props) {

    let loginText = props.isLoggedIn ? 'logged in' : 'anon';

    return (
        <div className="main">
            {loginText}
            <h1>Main</h1>
            {props.children}
        </div>
    );
};

Main.propTypes = {
    isLoggedIn : PropTypes.bool.isRequired
};
Main.defaultProps = {
    isLoggedIn : false
};