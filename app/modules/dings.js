import { fromJS, toJS } from 'immutable'
import { addDing, listenToDings, findClosestRoad } from 'helpers/api'
import { addListener } from 'modules/listeners'

const FETCHING_DING = 'FETCHING_DING'
const FETCHING_DING_ERROR = 'FETCHING_DING_ERROR'
const FETCHING_DING_SUCCESS = 'FETCHING_DING_SUCCESS'
const CREATE_DING = 'CREATE_DING'
const APPEND_DING = 'APPEND_DING'
const ADD_MULTIPLE_DINGS = 'ADD_MULTIPLE_DINGS'


function fetchingDing(){
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

function createDing(ding){
  return {
    type:CREATE_DING,
    ding
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
  return function(dispatch){

    let ding = {
      coordinates:coordinates,
      radius,
      timestamps:{}
    }

    ding.timestamps[timestamp] = {
      uid,
      value,
      timestamp
    }

    findClosestRoad(coordinates)
      .then((closestRoad)=>{
        const roadId = closestRoad.roadId
        ding = {...ding,roadId}
        return ding
      })
      .then((ding)=>addDing(ding))
      .then((result)=>{
        ding = {...ding,dingId:result.dingId}
        return result.dingPromise
      })
      .then(()=>dispatch(createDing(ding)))
  }
}

const initialState = fromJS({
  lastUpdated : 0,
  isFetching : false,
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
    case CREATE_DING:
      return state.merge({
        [action.ding.dingId]:action.ding
      })
    case APPEND_DING:
      return state
    case ADD_MULTIPLE_DINGS:
      return state.merge(action.dings)
    default:
      return state
  }
}