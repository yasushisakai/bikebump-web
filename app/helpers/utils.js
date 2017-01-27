import {
  minimalLatLngRefresh,
  renderTimeConstrain,
} from 'config/constants'

export function fetchGeoLocation() {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(formatGeoLocation(position.coords))
      },
      (error) => {
        reject(error)
      }, {
        enableHighAccuracy: true
      })
  })
}

export function formatGeoLocation(coords) {
  return {
    lat: coords.latitude,
    lng: coords.longitude,
  }
}

export function formatUser(name, email, avatar, uid) {
  return {
    name,
    email,
    avatar,
    uid,
  }
}


export function updateTimeConstrain (timestamp) {
  return Date.now() - timestamp > renderTimeConstrain 
}

/**
 * distFromLatLng
 * calculates the distance between two latlng values in Meters
 * ref:
 * http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 *
 * @param lat1
 * @param lng1
 * @param lat2
 * @param lng2
 * @returns {number} : distance in METERS
 */
export function distFromLatLng(start, end) {

  const R = 6378.137 * 1000; // Radius of the earth in m
  const dLat = (end.lat - start.lat) * (Math.PI / 180.0);
  const dLon = (end.lng - start.lng) * (Math.PI / 180.0);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start.lat * (Math.PI / 180.0)) * Math.cos(end.lat * (Math.PI / 180.0)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in meters

  return d;
}

export function getTotalLength(geometry){
  if(geometry.type==='LineString'){
    return geometry.coordinates.reduce((length,coordinate,index,coordinates)=>{
      if(index === 0 ) return 0
      else{
        const previousCoordinate = {lat:coordinates[index-1][1],lng:coordinates[index-1][0]}
        const currentCoordinate = {lat:coordinate[1],lng:coordinate[0]}
        return length + distFromLatLng(previousCoordinate,currentCoordinate)
      }
    },0)
  }else if(geometry.type ==="MultiLineString"){
    return geometry.coordinates.reduce((length,lineString)=>{
      const lineStringLength = lineString.reduce((partialLength,coordinate,index,coordinates)=>{
        if(index === 0 ) return 0
        else{
          const previousCoordinate = {lat:coordinates[index-1][1],lng:coordinates[index-1][0]}
          const currentCoordinate = {lat:coordinate[1],lng:coordinate[0]}

          return partialLength + distFromLatLng(previousCoordinate,currentCoordinate)
        }
      },0)
      return length+lineStringLength 
    },0)
  }
}

export function getDomainLength(geometry,{start,end}){
  const totalLength = getTotalLength(geometry)
  return totalLength * Math.abs(end-start)
}

export function refreshLatLng(timestamp) {
  return Date.now() - timestamp >= minimalLatLngRefresh
}

export function insertCSSLink(url) {
  let head = document.head
  let link = document.createElement('link')

  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url

  head.appendChild(link)
}

export function clearStorage() {
  localStorage.clear()
  sessionStorage.clear()
}