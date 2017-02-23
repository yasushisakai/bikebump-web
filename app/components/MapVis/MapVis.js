import React, { PropTypes } from 'react'
import { mapContents } from './styles.css'

export default function MapVis (props) {
  return (
    <div id="mainMap" className={mapContents}></div>
    )
}