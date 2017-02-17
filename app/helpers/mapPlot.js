import leaflet from 'leaflet'
import { toJS } from 'immutable'

const defaultStyle={
  lineCap:'butt',
  color:'#fff',
  opacity:1,
  weight:1,
  fill:false,
}

leaflet.icon({

})

export function plotRoad(road,_map,customStyle,callback=()=>{}) {

  const style = {...defaultStyle,...customStyle}

  if(road.geometry.type === 'LineString'){
    const coordinates = road.geometry.coordinates.map((coordinate)=>{
      return coordinate.reverse()
    })
    const path = leaflet.polyline(coordinates,style)
    path.addEventListener('click', ()=>{
      callback(road.roadId)
      console.log(road.roadId)
    })
    path.addTo(_map)
  }else{ // multilineString
    road.geometry.coordinates.map((coordinates)=>{
      const lineString = coordinates.map((coordinate)=>{
        return coordinate.reverse()
      })
      const path = leaflet.polyline(coordinates,style)
        path.addEventListener('click', ()=>{
          callback(road.roadId)
          console.log(road.roadId)
        }
        )
        path.addTo(_map)
    })

  }
}


export function plotSpliced(splicedRoad,map,customStyle={}){
  //flip

  const flipped = splicedRoad.map((coordinate)=>{
    console.log(coordinate)
    return coordinate.reverse()
  })

  const style={...defaultStyle, ...customStyle}

  leaflet.polyline(flipped,style).addTo(map)
}


export function plotCommute(commute,map,customStyle={}){
  
  if(commute.hasOwnProperty('commuteId')) return
  if(commute.hasOwnProperty('lat')) return // FIXME

  // console.log(Object.keys(commute).length)

  const coords = Object.keys(commute)
    .filter(key=> key !== 'uid' && key !== 'commuteId')
    .map(key=>{
      return commute[key]
    })

  leaflet.polyline(coords,{...defaultStyle,...customStyle}).addTo(map)
}

export function plotDing(ding,map,customStyle={}){
  const coords = ding.coordinates
  const style = {...defaultStyle,...customStyle}
  // 

  // circle
  leaflet.circle(coords,10,style).addTo(map)

  Object.keys(ding.timestamps).map((timestamp,index)=>{
    leaflet.circle(coords,10+3*(index+1),style).addTo(map)
  })

}