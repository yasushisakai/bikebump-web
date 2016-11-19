/**
 * bikebump
 * Main.jsx
 * by yasushisakai
 * 10/13/16
 */

import React, {PropTypes} from 'react'
import StatusBar from './StatusBar';


/**
 * Main Stateless Function
 */
export default function Main(props) {

    let userName = props.isLoggedIn ? 'someone' : 'nobody';

    return (
        <div className="main">
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