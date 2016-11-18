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
            <div id="coordination-indicator" className="circle red indicator"></div>
            <span className="info-location"> location({props.lat.toFixed(6)},{props.lng.toFixed(6)}) </span>
            <span className="info-status">{props.status}</span>
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