/**
 * bikebump
 * Map.jsx
 * by yasushisakai
 * 10/13/16
 */

import React, {PropTypes} from 'react'


/**
 * Map Stateless Function
 */
export default function Map(props) {

    return (
        <div className="map">
            this is a map
            {props.children}
        </div>
    );
};

Map.propTypes = {};

Map.defaultProps = {};