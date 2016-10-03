// created at 2016.10.03
// by yasushisakai

import React, {PropTypes} from 'react'

//
// StatusBar Stateless Function
//
export default function StatusBar(props) {
    return (
        <div className="status-bar">
            <span className="status-user"> {props.userId} </span>
        </div>
    );
};

StatusBar.propTypes = {
    userId : PropTypes.string.isRequired
};
StatusBar.defaultProps = {};