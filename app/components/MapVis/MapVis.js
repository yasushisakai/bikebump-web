import React, { PropTypes } from 'react'
import {Map, toJS} from 'immutable'
import leaflet from 'leaflet'
import { plotRoad, plotCommute, plotDing } from 'helpers/mapPlot'
import { insertCSSLink } from 'helpers/utils'


MapVis.propTypes={
  dom:PropTypes.object.isRequired,
  roads:PropTypes.object.isRequired,
  commutes:PropTypes.object.isRequired,
  dings:PropTypes.object.isRequired,
  roadClick:PropTypes.func.isRequired,
  latestLocation:PropTypes.object.isRequired,
}

export default function MapVis (props) {

  insertCSSLink('https://unpkg.com/leaflet@1.0.2/dist/leaflet.css')
  props.dom.style.width='100%'

  const position = [
    props.latestLocation.get('lat'),
    props.latestLocation.get('lng')
  ]

  const tileURL = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA'
  const attribution = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe'

  let map = leaflet.map('map').setView([42.3553906,-71.1030873],17)

  leaflet.tileLayer(tileURL,{attribution,maxZoom:18}).addTo(map)

  props.commutes.map((commute,index)=>{
    // hyper functional wonderland
    if(commute instanceof Map && index.startsWith('-K') ){
      const sorted = commute.keySeq().toArray().filter(key=>key!=='uid').sort().map(key=>commute.get(key))

      plotCommute(sorted,map)
    }
  })
  
  props.dings.map((ding,index)=>{
    if(ding instanceof Map){
      // console.log(index,ding.toJS())
      plotDing(ding,map,{color:'#0F0',weight:1.5,opacity:0.5})
      }
    })

    props.roads.map(road=>{
    if(road instanceof Map){
     plotRoad(road,map,{color:'#fff',weight:5,opacity:0.5},props.roadClick)
    }
  })

  return null
}