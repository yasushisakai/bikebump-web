// created at 2016.10.02
// by yasushisakai

import React, {PropTypes} from 'react'
import StatusBar from './StatusBar';


//
// Main Stateless Function
//
export default function Main(props) {

    let userName = props.isLoggedIn ? 'someone' : 'nobody';

    return (
        <div className="main">
            <StatusBar userId={userName}/>
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