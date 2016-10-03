// created at 2016.10.02
// by yasushisakai

import React, {PropTypes} from 'react';

//
// Option Stateless Function
//
export default function Option(props) {
    return (
        <button type="button" onClick={props.onClick}>{props.text}</button>
    );
};

Option.propTypes = {
    text : PropTypes.string.isRequired,
    onClick : PropTypes.func.isRequired
};

Option.defaultProps = {
};