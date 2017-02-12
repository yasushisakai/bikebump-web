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

export function plotRoad(road,_map,customStyle,callback) {

  const style = {...defaultStyle,...customStyle}

  if(road.getIn(['geometry','type']) === 'LineString'){
    const coordinates = road.getIn(['geometry','coordinates']).toJS().map((coordinate)=>{
      return coordinate.reverse()
    })
    const path = leaflet.polyline(coordinates,style)
    path.addEventListener('click', ()=>{
      callback(road.get('roadId'))
      console.log(`localhost:8081/road/${road.get('roadId')}`)
    })
    path.addTo(_map)
  }else{ // multilineString
    road.getIn(['geometry','coordinates']).toJS().map((coordinates)=>{
      const lineString = coordinates.map((coordinate)=>{
        return coordinate.reverse()
      })
      const path = leaflet.polyline(coordinates,style)
        path.addEventListener('click', ()=>{
          callback(road.get('roadId'))
          console.log(`localhost:8081/road/${road.get('roadId')}`)
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
  const coords=commute
    .filter((coord)=>!(typeof coord === 'string'))
    .filter((coord)=>coord.get('lat'))
    .map(coord=>{
      return coord.toJS()
    })
  leaflet.polyline(coords,{...defaultStyle,...customStyle}).addTo(map)
}

export function plotDing(ding,map,customStyle={}){
  const coords = ding.get('coordinates').toJS()
  const style = {...defaultStyle,...customStyle}
  // 

  // circle
  leaflet.circle(coords,10,style).addTo(map)

  ding.get('timestamps').keySeq().toArray().map((timestamp,index)=>{
    leaflet.circle(coords,10+3*(index+1),style).addTo(map)
  })

}