// created at 2016.10.02
// by yasushisakai

import React, {PropTypes} from 'react';

//
// Option Stateless Function
//
export default function Option(props) {

    let text = props.options[0];


    return (
            <div className="button" type="button" style={
        {
        backgroundColor:props.options[1],
        color:props.options.length ==3 ? props.options[2]:'#000000'
        }} onClick={props.onClick}><div className="button-text">{text}</div></div>
    );
};

Option.propTypes = {
    options: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
};

Option.defaultProps = {};