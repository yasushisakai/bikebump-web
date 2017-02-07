import React, { PropTypes } from 'react'
import { insertCSSLink } from 'helpers/utils'
import leaflet from 'leaflet'
import { Map } from 'immutable'

RoadVis.propTypes = {
  road:PropTypes.instanceOf(Map),
}

export default function RoadVis (props) {
  console.log('render component')
  insertCSSLink('https://unpkg.com/leaflet@1.0.2/dist/leaflet.css')

  const mapElement = document.createElement('div')
  mapElement.id = 'map'
  mapElement.style.width='100%'
  mapElement.style.height='500px'
  const app = document.getElementById('app')
  app.appendChild(mapElement)
 
  console.log(props.road.toJS())
  console.log(props.road.getIn(['geometry','coordinates']).toJS())


  const coordinates = props.road.getIn(['geometry','coordinates']).toJS().map((coordinate)=>{
    return coordinate.reverse()
  })


  const position = [42.361145, -71.057083]
  
  // this is sourced from mapbox you can change it with you style
  const tileURL = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA'
  const attribution = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe'

  let map = leaflet.map('map').setView(position,13) 

  leaflet.tileLayer(tileURL,{attribution:attribution,maxZoom:18}).addTo(map)
  leaflet.polyline(coordinates).addTo(map)

  return (
    <div>{props.road.get('name')}</div>
  )
}