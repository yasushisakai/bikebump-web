// @flow
import React from 'react';
import { map, mapVisContainer } from './styles.css';
import { BikeCoinBadgeContainer } from 'containers';

export default function MapVis () {
    return (
       <div className={mapVisContainer}>
            <BikeCoinBadgeContainer/>
            <div id='mainMap' className={map}/>
        </div>
    );
}
