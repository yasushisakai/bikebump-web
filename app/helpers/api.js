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
    .then((snapshot)=>(snapshot.val()||{}))
}

export function fetchRoads () {
  return ref.child(`roads`).once('value')
    .then((snapshot)=>(snapshot.val()||{}))
}

export function fetchCommutes () {
  return ref.child('commutes').once('value')
    .then((snapshot)=>(snapshot.val()||{}))
}

export function saveCommute (uid,breadcrumbs) {
  const commuteId = ref.child('commutes').push().key
  const commute = {...breadcrumbs,commuteId,uid}
  return ref.child(`commutes/${commuteId}`).set(commute)
    .then(()=>commute)
}

export function createCommute (uid) {
  // initiates a commute
  const commuteId = ref.child('commutes').push().key
  return ref.child(`commutes/${commuteId}`).set({uid})
    .then(()=>commuteId)
}

export function appendBreadcrumb (commuteId,coordinate,timestamp=Date.now()) {
  ref.child(`commutes/${commuteId}/${timestamp}`).set(coordinate)
    .then(()=>(null))
}

export function fetchPatterns() {
  return ref.child(`patterns/`).once('value')
    .then((snapshot)=>snapshot.val())
}

export function fetchPattern(patternId){
  return ref.child(`patterns/${patternId}`).once('value')
    .then((snapshot)=>snapshot.val())
}

export function savePattern({patternText,budget}){
  const patternId = ref.child('patterns').push().key
  const newPattern = {text:patternText,budget,patternId}
  console.log(newPattern)
  return ref.child(`patterns/${patternId}`).set(newPattern)
    .then(()=>newPattern)
}

export function fetchProposals () {
  return ref.child(`proposals`).once('value')
    .then((snapshot)=>snapshot.val())
}

export function fetchProposal (proposalId) {
  return ref.child(`proposals/${proposalId}`).once('value')
    .then((snapshot)=>(snapshot.val()||{}))
}


export function saveProposal(proposal){
  const proposalId = ref.child(`proposals/${proposal.roadId}`).push().key
  const proposalWithId = {...proposal,proposalId}
  return ref.child(`proposals/${proposal.roadId}/${proposalId}`).set(proposalWithId)
    .then(()=>proposalWithId)
}

export function saveResponse(response){
  const responseId = ref.child(`responses/${response.dingId}/${response.questionId}`).push().key
  const responseWithId = {...response,responseId}
  return ref.child(`responses/${response.dingId}/${response.questionId}/${responseId}`).set(responseWithId)
    .then(()=>responseWithId)
}

// TODO: we are reapeating this tooooooo much!!
export function save (branchName,object) {
  const objectId = ref.child(`${branchName}`).push().key
  const objectWithId = {...object,objectId}
  return ref.child(`${branchName}/${objectId}`).set(objectWithId)
    .then(()=>objectWithId)
}

export function fetchAll (branchName) {
  return ref.child(`${branchName}`).once('value')
    .then((snapshot)=>snapshot.val())
}

export function fetchUserStats (uid) {
  return ref.child(`userStats/${uid}`).once('value')
    .then((snapshot)=>(snapshot.val()||{}))
}

export function saveVote(uid,roadId,proposalId) {
  const promises = [
    ref.child(`proposals/${roadId}/${proposalId}/votes/${uid}`).set(true),
    ref.child(`userStats/${uid}/${roadId}/${proposalId}`).set(true)
  ]
  return Promise.all(promises)
}

export function deleteVote(uid,roadId,proposalId) {
  const promises = [
    ref.child(`proposals/${roadId}/${proposalId}/votes/${uid}`).set(null),
    ref.child(`userStats/${uid}/${roadId}/${proposalId}`).set(null)
  ]
  return Promise.all(promises)
}





