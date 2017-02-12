import React, { PropTypes } from 'react'
import {Map, toJS} from 'immutable'
import leaflet from 'leaflet'
import { plotRoad, plotCommute, plotDing, plotSpliced } from 'helpers/mapPlot'
import { insertCSSLink, spliceRoad } from 'helpers/utils'

Roads.propTypes={
  dom:PropTypes.object.isRequired,
  road:PropTypes.object.isRequired,
  latestLocation:PropTypes.object.isRequired,
}

export default function Roads (props) {
  insertCSSLink('https://unpkg.com/leaflet@1.0.2/dist/leaflet.css')
  props.dom.style.width='100%'
  props.dom.style.height='100vh'
  
  const position = [
    props.latestLocation.get('lat'),
    props.latestLocation.get('lng')
  ]

  const tileURL = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA'
  const attribution = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe'

  let map = leaflet.map('map').setView([42.3553906,-71.1030873],17)

  leaflet.tileLayer(tileURL,{attribution,maxZoom:18}).addTo(map)
  plotRoad(props.road,map,{color:'#fff',weight:5,opacity:0.5})

  const domain={index:1,start:0.1,end:0.8}

  const splicedRoad = spliceRoad(props.road.get('geometry').toJS(),domain)
  plotSpliced(splicedRoad,map)
  return null
}