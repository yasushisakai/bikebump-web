import leaflet from 'leaflet'
import { Map } from 'immutable'
import { imgRoot } from 'config/constants'
import { randomColor } from 'helpers/utils'

export const defaultStyle={
  lineCap:'butt',
  color:'#fff',
  opacity:1,
  weight:1,
  fill:false,
}

export const icon = leaflet.icon({
  iconUrl: `${imgRoot}cross.png`,
  iconSize : [5,5],
  iconAnchor : [3,3],
  popUpAnchor : [3,3],
})

export const popUpButtonStyleDisabled='cursor:pointer;padding:8px;font-size:1.5em;border:none;background-color:#fff;color:#ddd;'

export const popUpButtonStyleEnabled='cursor:pointer;padding:8px;font-size:1.5em;border:none;background-color:#fff;color:#F7D008;'

function latLngToPoint(coordinate){
  return leaflet.point(coordinate.lat,coordinate.lng)
}


export function roadLineStringToLatLngBound(road,){
  let latLngs=[];
  if(road.geometry.type==='LineString'){
    latLngs = road.geometry.coordinates 
  }else{
   road.geometry.coordinates.map((lineString)=>{
      lineString.map(coordinate=>{
        latLngs.push(coordinate)
      })
    })
  }

  return leaflet.latLngBounds(latLngs)
}


function pointToLatLng(point){
  return leaflet.latLng(point.x,point.y)
}

export function getClosestPoint(coordinate,road){
  // no need to use leaflet Point, 

  let closestDistance = 99999999999999999
  let closestPoint = null

  const basePoint = latLngToPoint(coordinate)

  if(road.geometry.type == "LineString") {
    road.geometry.coordinates.map((coord,index)=>{
      if(index !== 0) {
        const p1 = latLngToPoint(road.geometry.coordinates[index-1])
        const p2 = latLngToPoint(coord)

        //FIXME: this leaflet function is cheesy
        const tempDist = leaflet.LineUtil.pointToSegmentDistance(basePoint,p1,p2)
        if(tempDist < closestDistance){
          closestDistance = tempDist
          closestPoint = leaflet.LineUtil.closestPointOnSegment(basePoint,p1,p2)
        }
      }
    })
  }else{
    road.geometry.coordinates.map((coords)=>{
      coords.map((coord,index)=>{
        if(index !== 0) {
          const p1 = latLngToPoint(road.geometry.coordinates[index-1])
          const p2 = latLngToPoint(coord)

          const tempDist = leaflet.LineUtil.pointToSegmentDistance(basePoint,p1,p2)
          if(tempDist < closestDistance){
            closestDistance = tempDist
            closestPoint = leaflet.LineUtil.closestPointOnSegment(basePoint,p1,p2)
          }
        }
      })
    })
  }

  let closestDistanceInMeters = leaflet.latLng(coordinate).distanceTo(closestPoint)

  return {distance:closestDistanceInMeters, point:closestPoint}
}

//
// PLOT functions
//

export function plotRoad(road,_map,customStyle,callback) {

  const style = {...defaultStyle, opacity:0.4, weight:20 ,...customStyle}

  if(road.geometry.type === 'LineString'){
    const path = leaflet.polyline(road.geometry.coordinates,style)
    path.addEventListener('click', ()=>callback(road.properties.id))
    path.addTo(_map)
  }else{ // multilineString
    road.geometry.coordinates.map((coordinates)=>{
      const path = leaflet.polyline(coordinates,style)
        path.addEventListener('click', ()=>callback(road.properties.id))
        path.addTo(_map)
    })

  }
}

export function plotPolyline(coords,_map,customStyle){
  const style = {...defaultStyle, opacity:0.4, weight:10,color:randomColor() ,...customStyle}
  return leaflet.polyline(coords,style).addTo(_map)
}


export function plotCommute (commute,map,customStyle={}) {
  
  const coords = Object.keys(commute)
    .filter(key => key !== 'uid') // snip off uid value
    .sort()
    .map(key => {
      return commute[key]
    })

  const style = {...defaultStyle, color:'#ff0', opacity:0.1, weight:1, clickable:false, ...customStyle}
  
  leaflet.polyline(coords,style).addTo(map)
}

export function plotDing(ding,map,customStyle={}){
  const coords = ding.coordinates
  const style = {...defaultStyle,clickable:false,weight:2, opacity:0.7,...customStyle} 
  // marker
  leaflet.marker(coords,{icon,clickable:false}).addTo(map)
  // circle
  //leaflet.circle(coords,10,style).addTo(map)
  // line to cp
  //leaflet.polyline([coords,ding.closestRoadPoint],style,map).addTo(map)

  let skip = false
  let cnt = 0
  Object.keys(ding.timestamps).map((timestamp,index)=>{
    let colored = style
    if(ding.timestamps[timestamp].value===0){
      colored.color='#F20056'
    }else{
      colored.color = '#336699'
    }

    leaflet.circle(coords,10+3*(index),style).addTo(map)
  })

}
