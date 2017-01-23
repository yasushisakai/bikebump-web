import {minimalLatLngRefresh } from 'config/constants'

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

export function formatGeoLocation(coords){
  return {
    lat:coords.latitude,
    lng:coords.longitude,
  } 
}

export function formatUser(name,email,avatar,uid) {
  return {
    name,
    email,
    avatar,
    uid,
  }
}

export function refreshLatLng(timestamp){
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

export function clearStorage () {
  localStorage.clear()
  sessionStorage.clear()
}