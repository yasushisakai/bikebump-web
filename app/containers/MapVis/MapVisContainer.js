import React from 'react'
import { MapVis } from 'components'
import ReactDOM from 'react-dom'
import { findClosestRoad } from 'helpers/api'

const MapVisContainer = React.createClass({
  componentDidMount () {
    const coordinates = {lng:42.360152, lat:-71.0871862}
    console.log(
      `media lab is at: lat=${coordinates.lat} lng=${coordinates.lng}`
      )
    findClosestRoad(coordinates)
      .then((road)=>{
        console.log(road)
      })
  },
  render () {
    return (
      <MapVis/>
      )
  },
})


export default MapVisContainer