import {ref,isProduction} from 'config/constants'
import axios from 'axios'
import { apiRoot } from 'config/constants'

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
  const userDingPromise = ref.child(`userDings/${ding.uid}/${dingId}`).set(true)
  const promises = [dingPromise,userDingPromise]
  return {dingId, dingPromise:Promise.all(promises)}
}

export function createNewDing(lat,lng,uid,timestamp,value){
  return axios.post(`${apiRoot}dings/add`,{
    lat,
    lng,
    uid,
    timestamp,
    value,
  })
}

export function appendTimestampToDing(dingId,{timestamp,uid,value}){
  const p1 = ref.child(`dings/${dingId}/timestamps/${timestamp}`).set({timestamp,uid,value})
  const p2 = ref.child(`userDings/${uid}/${dingId}`).set(true)
  return Promise.all([p1,p2])
}

export function listenToDings( callback, errorCallback){
  ref.child(`dings/`).on('value',
    (snapshot)=>{
      const dings = snapshot.val() || {}
      callback(dings)
      return dings
    },
    errorCallback)
}

export function fetchDings() {
  return ref.child(`dings/`).once('value')
    .then(snapshot=>(snapshot.val()||{}))
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
  const promises = [
    ref.child(`responses/${response.dingId}/${response.questionId}/${responseId}`).set(responseWithId),
    ref.child(`userResponses/${response.uid}/${response.dingId}/${response.questionId}/${responseId}`).set(response.value)
  ]
  return Promise.all(promises).then(()=>responseWithId)
}

// TODO: we are reapeating this tooooooo much!!
export function save (branchName,object) {
  const objectId = ref.child(`${branchName}`).push().key
  const objectWithId = {...object,objectId}
  return ref.child(`${branchName}/${objectId}`).set(objectWithId)
    .then(()=>objectWithId)
}

export function saveQuestion (question) {
  const questionId = ref.child(`questions`).push().key
  const questionWithId = {...question, questionId}
  return ref.child(`questions/${questionId}`).set(questionWithId)
    .then(()=>questionWithId)
}

export function fetchAll (branchName) {
  return ref.child(`${branchName}`).once('value')
    .then((snapshot)=>snapshot.val())
}

export function fetchUserVotes (uid) {
  return ref.child(`userVotes/${uid}`).once('value')
    .then((snapshot)=>(snapshot.val()||{}))
}

export function saveVote(uid,roadId,proposalId,newCredit) {
  console.log('save vote',newCredit)
  const promises = [
    ref.child(`proposals/${roadId}/${proposalId}/votes/${uid}`).set(true),
    ref.child(`userVotes/${uid}/${roadId}`).set(proposalId),
    ref.child(`userVotes/${uid}/credits`).set(newCredit)
  ]
  return Promise.all(promises)
}

export function overwriteVote(uid,roadId,prevProposalId,newProposalId,newCredit) {
  const promises = [
    ref.child(`proposals/${roadId}/${prevProposalId}/votes/${uid}`).set(null),
    ref.child(`proposals/${roadId}/${newProposalId}/votes/${uid}`).set(true),
    ref.child(`userVotes/${uid}/${roadId}`).set(newProposalId),
    ref.child(`userVotes/${uid}/credits`).set(newCredit)
  ]
}

export function deleteVote(uid,roadId,proposalId,newCredit) {
  const promises = [
    ref.child(`proposals/${roadId}/${proposalId}/votes/${uid}`).set(null),
    ref.child(`userVotes/${uid}/${roadId}`).set(null),
    ref.child(`userVotes/${uid}/credits`).set(newCredit)
  ]
  return Promise.all(promises)
}


export function fetchUserResponses (uid) {
  return ref.child(`userResponses/${uid}`).once('value')
    .then((snapshot)=>(snapshot.val()||{}))
}

export function fetchUserDings (uid) {
  return ref.child(`userDings/${uid}`).once('value')
    .then((snapshot)=>(Object.keys(snapshot.val())||[]))
}


export function fetchUserSettings (uid) {
  return ref.child(`userSettings/${uid}`).once('value')
    .then((snapshot)=>snapshot.val()||{})
}

export function updateUserSettings (uid, variable, value) {
  return ref.child(`userSettings/${uid}/${variable}`).set(value)
}