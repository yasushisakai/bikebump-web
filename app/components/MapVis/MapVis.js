import React, { PropTypes } from 'react'
import { mapContents } from './styles.css'
import { insertCSSLink } from 'helpers/utils'

export default function MapVis (props) {
  insertCSSLink('https://unpkg.com/leaflet@1.0.2/dist/leaflet.css')
  return (
    <div id="mainMap" className={mapContents}></div>
    )
}