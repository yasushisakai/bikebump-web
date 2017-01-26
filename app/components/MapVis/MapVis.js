import React, { PropTypes } from 'react'
import { Map as LeafletMap, Marker, Popuup, TileLayer, Circle, Polyline} from 'react-leaflet'
import { insertCSSLink } from 'helpers/utils'


MapVis.propTypes={
  isFetching : PropTypes.bool.isRequired,
  commutes : PropTypes.array.isRequired,
}

export default function MapVis (props) {
  console.log('MapVis Compoment Render!!')
  // we need to put a special css file in order to render correctly
  insertCSSLink('https://unpkg.com/leaflet@1.0.2/dist/leaflet.css')
  
  const position = [42.361145, -71.057083]
  
  // this is sourced from mapbox you can change it with you style
  const tileURL = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA'
  const attribution = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe'

  function drawPolyLines(commutes) {
    return commutes.map((commute,index)=>{
      console.log('commute',index)

      const latlngs = Object.keys(commute).filter((commutePoint)=>{
        return commutePoint !== 'uid' && commutePoint !== 'commuteId'
      }).map((commutePoint)=>{
          console.log('commutePoint',commutePoint)
          var lat = commute[commutePoint].coordinate.lat
          var lng = commute[commutePoint].coordinate.lng
          const latlng = [lat,lng]
          return latlng 

      })

      console.log(latlngs)

        return drawPolyLine(index,latlngs)
    })
  }

  function drawPolyLine(key,latlngs) {
    console.log(latlngs)
    return <Polyline key={key} positions={latlngs} />
  }

  function drawCircle(center, index) {
    return <Circle center={center} radius={5+2*index} weight={.5} key={index}/>
  }

  function drawCircles(dings) {
    return dings.map((ding, index)=>{
      const coord = {
        lat: ding.coordinates.lat,
        lng: ding.coordinates.lng
      }
      return drawCircle(coord, index)
    })
  }

  return props.isFetching === true
  ? (
      <div>
        <h2>Fetching</h2>
      </div>
    )
  : (
      <LeafletMap style={{height:"100vh"}} center={position} zoom={15}>
        <TileLayer url={tileURL} attribution={attribution} />
        {drawCircles(props.dings)}
        {drawPolyLines(props.commutes)}
      </LeafletMap>
    )
}