import {ref,isRemote} from 'config/constants'
import axios from 'axios'

export function fetchUser(uid){
  return ref.child(`users/${uid}`).once('value')
    .then((snapshot)=>snapshot.val())
}

export function findClosestRoad({lat,lng}){
  const serverURL = isRemote === true ?'https://bikebump.media.mit.edu/':'http://localhost:8081/'
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

export function appendDing(dingId,{timestamp,uid,value}){
  ref.child(`dings/${dingId}/timestamps`)
}