import React, { PropTypes } from 'react'
import { insertCSSLink, getCenter, spliceRoad } from 'helpers/utils'
import { plotRoad, plotSpliced } from 'helpers/mapPlot'
import leaflet from 'leaflet'
import { Map, toJS } from 'immutable'


// fancy 
// http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/

RoadVis.propTypes = {
  road:PropTypes.instanceOf(Map),
}

export default function RoadVis (props) {
  console.log('render component')
  insertCSSLink('https://unpkg.com/leaflet@1.0.2/dist/leaflet.css')

    const mapElement = document.createElement('div')
    mapElement.id = 'map'
    document.getElementById('app').appendChild(mapElement) 

    mapElement.style.width='100%'
    mapElement.style.height='500px'

  const position=[props.latestLocation.get('lat'),props.latestLocation.get('lng')]
  
  // this is sourced from mapbox you can change it with you style
  const tileURL = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA'
  const attribution = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe'

  if(map !== undefined) map.remove()
  let map = leaflet.map('map').setView(position,17) 

  leaflet.tileLayer(tileURL,{attribution:attribution,maxZoom:18}).addTo(map)
  console.log(props.road.toJS())
  plotRoad(props.road,map)

  const domain = {index:1,start:0.1,end:0.9}
  const splicedRoad = spliceRoad(props.road.get('geometry').toJS(),domain)
  plotSpliced(splicedRoad,map,{color:'#fff',weight:5})

  return (
    <div >{props.road.get('name')}</div>
  )
}