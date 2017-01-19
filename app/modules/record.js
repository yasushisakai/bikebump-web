import {fromJS} from 'immutable'
import {fetchGeoLocation} from 'helpers/utils'

const STOP_RECORDING = 'STOP_RECORDING'
const START_RECORDING = 'START_RECORDING'

const FETCHING_LATLNG = 'FETCHING_LATLNG'
const FETCHING_LATLNG_ERROR = 'FETCHING_LATLNG_ERROR'
const FETCHING_LATLNG_SUCCESS = 'FETCHING_LATLNG_SUCCESS'

const initialState = fromJS({
  isFetchingLatLng:false,
  isRecording:false,
  latestLocation:{
    lat: 0,
    lng: 0,
  },
  latestFetch:0,
  error:'',
})

function stopRecording () {
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
    getState().record.get('isRecording') === true
    ? dispatch(stopRecording())
    : dispatch(startRecording())
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

export default function record(state=initialState,action){
  switch (action.type) {
    case STOP_RECORDING:
      return state.merge({
        isRecording:false,
      })
    case START_RECORDING:
      return state.merge({
        isRecording:true,
      })
    case FETCHING_LATLNG:
      return state.merge({
        isFetchingLatLng:true,
      })
    case FETCHING_LATLNG_ERROR:
      return state.merge({
        isFetchingLatLng:false,
        error:action.error,
      })
    case FETCHING_LATLNG_SUCCESS:
      return state.merge({
        isFetchingLatLng:false,
        latestFetch:action.timestamp,
        latestLocation:action.location,
      })
    default:
      return state
  }
}