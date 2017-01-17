import {ref,isRemote} from 'config/constants'
import axios from 'axios'

export function fetchUser(uid){
  return ref.child(`users/${uid}`).once('value')
    .then((snapshot)=>snapshot.val())
}

export function findClosestRoad({lat,lng}){
  const serverURL = isRemote === true ?'https://bikebump.media.mit.edu/':'http://localhost:8081/'
  return axios.get(`${serverURL}api/find?lat=${lat}&lng=${lng}`,{header:{}})
    .then((response)=>{
      return response.data
    })
}