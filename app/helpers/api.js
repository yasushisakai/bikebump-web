import {ref,isProduction} from 'config/constants'
import axios from 'axios'

export function fetchUser(uid){
  return ref.child(`users/${uid}`).once('value')
    .then((snapshot)=>snapshot.val())
}


export function findClosest({lat,lng}){
  const serverURL = isProduction === true ?'https://bikebump.media.mit.edu/':'http://localhost:8081/'
  axios.get(`${serverURL}find?lat=${lat}&lng=${lng}`)
    .then((response)=>{
      return JSON.parse(response.data)
    })

}