// bikebump
// Loading
// by yasushisakai
// 10/22/16

import React from 'react'


//
// Loading Stateless Function
//
export default function Loading(props) {

    return (
        <div>
            <h1>Loading...</h1>
            <p> {props.text} </p>
        </div>
    );
};

Loading.propTypes = {
    text:React.PropTypes.string.isRequired
};

Loading.defaultProps = {
    text:' '
};

