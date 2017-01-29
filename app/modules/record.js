import {fromJS, toJS} from 'immutable'
import {fetchGeoLocation} from 'helpers/utils'
import {saveCommute} from 'helpers/api'
import { addCommute } from 'modules/commutes'

const STOP_RECORDING = 'STOP_RECORDING'
const START_RECORDING = 'START_RECORDING'
const ADD_BREADCRUMB = 'ADD_BREADCRUMB'

const FETCHING_LATLNG = 'FETCHING_LATLNG'
const FETCHING_LATLNG_ERROR = 'FETCHING_LATLNG_ERROR'
const FETCHING_LATLNG_SUCCESS = 'FETCHING_LATLNG_SUCCESS'

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'


export function stopRecording () {
  return {
    type:STOP_RECORDING,
  }
}

function startRecording () {
  return {
    type:START_RECORDING,
  }
}

export function toggleRecording () {
  return function(dispatch,getState){
    if(getState().record.get('isRecording')===true){
      const uid = getState().users.get('authedId')
      const breadcrumbs = getState().record.get('breadcrumbs').toJS()
      if(Object.keys(breadcrumbs).length >= 1)
      {
        saveCommute(uid,breadcrumbs)
          .then((commute)=>dispatch(addCommute(commute)))
      }else{
        console.log('commute unable to save, no breadcrumbs!')
              }
      dispatch(stopRecording())
    }else{
      dispatch(startRecording())
    }
  }
}

function fetchingLatLng () {
  return {
    type:FETCHING_LATLNG,
  }
} 

function fetchingLatLngError (error) {
  console.warn(error)
  return {
    type:FETCHING_LATLNG_ERROR,
    error: 'error fetching latlng'
  }
}

function fetchingLatLngSuccess (location,timestamp=Date.now()) {
  return {
    type:FETCHING_LATLNG_SUCCESS,
    location,
    timestamp,
  }
}

function locationChange () {
  return {
    type:LOCATION_CHANGE,
  }
}

export function handleLocationChange () {
  return function (dispatch) {
    dispatch(locationChange)
  }
}

export function handleFetchLatLng () {
  return function(dispatch,getState) {
    dispatch(fetchingLatLng())
    return fetchGeoLocation()
      .then((coordinates)=>{
        dispatch(fetchingLatLngSuccess(coordinates))
      })
      .catch((error)=>dispatch(fetchingLatLngError(error)))
  }
}

const initialState = fromJS({
  isFetchingLatLng:false,
  isRecording:false,
  latestLocation:{
    lat: 0,
    lng: 0,
  },
  latestFetchAttempt:0,
  latestFetch:0,
  error:'',
  breadcrumbs : {}
})

export default function record(state=initialState,action){
  switch (action.type) {
    case STOP_RECORDING:
      return state.merge({
        isRecording:false,
      })
    case START_RECORDING:
      return state.merge({
        isRecording:true,
        breadcrumbs:{}, //initiation
      })
    case FETCHING_LATLNG:
      return state.merge({
        isFetchingLatLng:true,
        latestFetchAttempt:Date.now(),
      })
    case FETCHING_LATLNG_ERROR:
      return state.merge({
        isFetchingLatLng:false,
        error:action.error,
      })
    case LOCATION_CHANGE:
      console.log('location change')
      return state.merge({
        isRecording:false,
      })
    case FETCHING_LATLNG_SUCCESS:
      return state.merge({
        isFetchingLatLng:false,
        latestFetch:action.timestamp,
        latestLocation:action.location,
      }).setIn(
        ['breadcrumbs',action.timestamp],
          {
            timestamp:action.timestamp,
            coordinate:action.location,
          }
        )
    default:
      return state
  }
}