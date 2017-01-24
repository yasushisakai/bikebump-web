import {ref,isProduction} from 'config/constants'
import axios from 'axios'

export function fetchUser(uid){
  return ref.child(`users/${uid}`).once('value')
    .then((snapshot)=>snapshot.val())
}

export function findClosestRoad({lat,lng}){
  const serverURL = isProduction === true ?'https://bikebump.media.mit.edu/':'http://localhost:8081/'
  return axios.get(`${serverURL}api/road/closest?lat=${lat}&lng=${lng}`,{header:{}})
    .then((response)=>{
      return response.data
    })
}

export function addDing(ding){
  const dingId = ref.child(`dings`).push().key
  const dingPromise = ref.child(`dings/${dingId}`).set({...ding,dingId})

  return {dingId, dingPromise}
}

export function appendTimestampToDing(dingId,{timestamp,uid,value}){
  return ref.child(`dings/${dingId}/timestamps/${timestamp}`).set({timestamp,uid,value})
}

export function listenToDings( callback, errorCallback){
  ref.child(`dings/`).on('value',
    (snapshot)=>{
      const dings = snapshot.val() || {}
      callback(dings)
    },
    errorCallback)
}

export function fetchRoad (roadId) {
  return ref.child(`roads/${roadId}`).once('value')
    .then((snapshot)=>snapshot.val())
}