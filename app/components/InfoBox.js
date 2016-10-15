// bikebump
// InfoBox
// by yasushisakai
// 10/14/16

import React, {PropTypes} from 'react'


//
// InfoBox Stateless Function
//
export default function InfoBox(props) {

    return (
        <div id="infoBox" className="infobox">
            location({props.lat},{props.lng})
            {props.status}
        </div>
    );
};

InfoBox.propTypes = {
    lat : PropTypes.number.isRequired,
    lng : PropTypes.number.isRequired,
    status : PropTypes.string.isRequired

};

InfoBox.defaultProps = {

};