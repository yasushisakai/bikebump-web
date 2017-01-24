import React, { PropTypes } from 'react'
import { Map as LeafletMap, Marker, Popuup, TileLayer} from 'react-leaflet'
import { insertCSSLink } from 'helpers/utils'


MapVis.propTypes={
  isFetching : PropTypes.bool.isRequired,
}

export default function MapVis (props) {
  // we need to put a special css file in order to render correctly
  insertCSSLink('https://unpkg.com/leaflet@1.0.2/dist/leaflet.css')
  
  const position = [42.361145, -71.057083]
  
  // this is sourced from mapbox you can change it with you style
  const tileURL = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA'
  const attribution = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe'

  return props.isFetching === true
  ? (
      <div>
        <h2>Fetching</h2>
      </div>
    )
  : (
      <LeafletMap style={{height:"100vh"}} center={position} zoom={15}>
        <TileLayer url={tileURL} attribution={attribution} />
      </LeafletMap>
    )
}