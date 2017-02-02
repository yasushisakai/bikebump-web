import { fromJS, toJS, Map } from 'immutable'
import { addDing, appendTimestampToDing, listenToDings, findClosestRoad } from 'helpers/api'
import { addListener } from 'modules/listeners'
import {distFromLatLng} from 'helpers/utils'

const FETCHING_DING = 'FETCHING_DING'
const FETCHING_DING_ERROR = 'FETCHING_DING_ERROR'
const FETCHING_DING_SUCCESS = 'FETCHING_DING_SUCCESS'
const REMOVE_FETCHING = 'REMOVE_FETCHING'
export const CREATE_DING = 'CREATE_DING'
export const APPEND_DING = 'APPEND_DING'
const ADD_MULTIPLE_DINGS = 'ADD_MULTIPLE_DINGS'


export function fetchingDing(){
  return {
    type:FETCHING_DING,
  }
}

function fetchingDingError(error){
  console.warn(error)
  return {
    type:FETCHING_DING_ERROR,
    error: 'error fetching ding'
  }
}

function fetchingDingSuccess(ding){
  return {
    type:FETCHING_DING_SUCCESS,
    ding
  }
}

export function removeFetching(){
  return {
    type:REMOVE_FETCHING,
  }
}

function createDing(ding){
  return {
    type:CREATE_DING,
    ding,
  }
}

function appendDing(dingId,{timestamp,uid,value}){
  return {
    type:APPEND_DING,
    dingId,
    timestamp,
    uid,
    value,
  }
}



export function addMultipleDings(dings){
  return {
    type:ADD_MULTIPLE_DINGS,
    dings
  }
}

export function handleCreateDing(ding){
  return function(dispatch) {
  const {dingId, dingPromise} = addDing(ding)
  dingPromise
    .then(()=>{
      dispatch(createDing({...ding,dingId}))
    })
  }
}

export function handleComplieDing(uid,coordinates,timestamp,radius,value){
  return function(dispatch,getState){

    // create the timestamp first
    const timestampData = {
      uid,
      value,
      timestamp
    }

    // get all dings check the distance
    let minimalDistance = 100 //meters
    let closestDingId = ''
    const dingIds = getState().dingFeed.get('dingIds')
    dingIds.map((dingId)=>{
      const ding = getState().dings.get(dingId)
      const start = ding.get('coordinates').toJS()
      const end = coordinates
      const distance = distFromLatLng(start,end)
      if (minimalDistance > distance && distance < ding.get('radius')) {
        minimalDistance = distance
        closestDingId = dingId
      }
    })

    if(minimalDistance < 10) {
      appendTimestampToDing(closestDingId,timestampData)
        .then(()=>dispatch(appendDing(closestDingId,timestampData)))
    } else {
      // create new one
      let newDing = {
        coordinates,
        radius,
        timestamps:{
          [timestamp]:timestampData
        }
      }
    findClosestRoad(coordinates)
      .then((closestRoad)=>{
        const roadId = closestRoad.roadId
        newDing = {...newDing,roadId}
        return newDing
      })
      .then((newDing)=>addDing(newDing))
      .then((result)=>{
        newDing = {...newDing,dingId:result.dingId}
        return result.dingPromise
      })
      .then(()=>dispatch(createDing(newDing)))
    }
  }
}


const initialState = fromJS({
  lastUpdated : 0,
  isFetching : true,
  error : '',
})

export default function dings(state=initialState, action) {
  switch (action.type) {
    case FETCHING_DING:
      return state.merge({
        isFetching:true
      })
    case FETCHING_DING_ERROR:
      return state.merge({
        isFetching:false,
        error : action.error
      })
    case FETCHING_DING_SUCCESS:
      return state.merge({
        isFetching:false,
        [action.ding.dingId]:action.ding
      })
    case REMOVE_FETCHING:
      return state.set('isFetching',false)
    case CREATE_DING:
      return state.merge({
        [action.ding.dingId]:action.ding
      })
    case APPEND_DING:
      return state.setIn(
        [action.dingId,'timestamps',action.timestamp],
        Map({uid:action.uid,timestamp:action.timestamp,value:action.value})
        )
    case ADD_MULTIPLE_DINGS:
      return state.merge(action.dings)
    default:
      return state
  }
}