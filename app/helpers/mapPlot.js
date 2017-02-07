import leaflet from 'leaflet'
import { toJS } from 'immutable'

const defaultStyle={
  lineCap:'butt',
  color:'#fff',
  opacity:1,
  weight:1,
}

export function plotRoad(road,_map,customStyle) {

  const style = {...defaultStyle,...customStyle}

  if(road.getIn(['geometry','type']) === 'LineString'){
    const coordinates = road.getIn(['geometry','coordinates']).toJS().map((coordinate)=>{
      return coordinate.reverse()
    })
    leaflet.polyline(coordinates,style).addTo(_map)
  }else{ // multilineString
    road.getIn(['geometry','coordinates']).toJS().map((coordinates)=>{
      const lineString = coordinates.map((coordinate)=>{
        return coordinate.reverse()
      })
      leaflet.polyline(lineString,style).addTo(_map)
    })

  }
}


export function plotSpliced(splicedRoad,map,customStyle={}){
  //flip
  const flipped = splicedRoad.map((coordinate)=>{
    return coordinate.reverse()
  })

  const style={...defaultStyle, ...customStyle}

  leaflet.polyline(flipped,style).addTo(map)
}