// bikebump
// Base
// by yasushisakai
// 10/13/16

import React, {PropTypes} from 'react'


//
// Main Stateless Function
//
export default function Base(props) {

    return (
        <div className="base">
            {props.children}
        </div>
    );
};

Base.propTypes = {};

Base.defaultProps = {};