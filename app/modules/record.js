import { fromJS, toJS } from 'immutable'
import { fetchGeoLocation, refreshCommute, formatWavFileName } from 'helpers/utils'
import { createCommute, appendBreadcrumb } from 'helpers/api'
import { storeBlob } from 'helpers/storage'
import { addCommute } from 'modules/commutes'

const STOP_RECORDING = 'STOP_RECORDING'
const START_RECORDING = 'START_RECORDING'
const UPDATE_BREADCRUMB = 'UPDATE_BREADCRUMB'
const RECORD_ERROR = 'RECORD_ERROR'

const UPLOADING_CLIP = 'UPLOADING_CLIP'
const UPLOADING_CLIP_ERROR = 'UPLOADING_CLIP_ERROR'
const UPLOADING_CLIP_SUCCESS = 'UPLOADING_CLIP_SUCCESS'

const FETCHING_LATLNG = 'FETCHING_LATLNG'
const FETCHING_LATLNG_ERROR = 'FETCHING_LATLNG_ERROR'
const FETCHING_LATLNG_SUCCESS = 'FETCHING_LATLNG_SUCCESS'

function stopRecording () {
  return {
    type:STOP_RECORDING,
  }
}

function startRecording (commuteId) {
  return {
    type:START_RECORDING,
    commuteId,
  }
}

function recordError (error) {
  console.warn(error)
  return {
    type:RECORD_ERROR,
    error : 'error recording'
  }
}


export function uploadingClip () {
  return {
    type: UPLOADING_CLIP,
  }
}

export function uploadingClipError (error) {
  console.warn(error)
  return {
    error: 'error uploading clip',
    type: UPLOADING_CLIP_ERROR,
  }
}

export function uploadingClipSuccess () {
  return {
    type: UPLOADING_CLIP_SUCCESS,
  }
}

export function handleUpload(recorder,location,timestamp){
  return function(dispatch,getState){
    
    if(getState().record.get('isUploading')) return

    dispatch(uploadingClip())
    recorder.exportWAV((blob)=>{
      const filename = formatWavFileName(timestamp,location)
      console.log(filename)
      storeBlob(filename,blob)
        .then(()=>uploadingClipSuccess())
    })
  }
}



export function handleRecordInitiation (uid) {
  return function (dispatch,getState) {
    return createCommute(uid)
      .then((commuteId)=>dispatch(startRecording(commuteId)))
  }
}

export function toggleRecording () {
  return function(dispatch,getState){

    if(
        getState().record.get('isRecording')===true ||
        getState().users.get('isAuthed')===false
      ){
      dispatch(stopRecording())
      return Promise.resolve({isRecording:false})
    }else{
      const authedId = getState().users.get('authedId')
      return dispatch(handleRecordInitiation(authedId))
        .then((action)=>Promise.resolve({isRecording:true,commuteId:action.commuteId}))
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

export function handleFetchLatLng (commuteId) {
  return function(dispatch,getState) {
    dispatch(fetchingLatLng())
    return fetchGeoLocation()
      .then((coordinates)=>dispatch(fetchingLatLngSuccess(coordinates)))
      .then(({location,timestamp})=>{
        if(refreshCommute(timestamp)){
          // if the commutee is too old reinitiate it
          dispatch(stopRecording())
          // handleRecordInitiation()
        }else{
          // else, the commute is still alive append
          appendBreadcrumb(commuteId,location,timestamp)
        }
      })
      .catch((error)=>dispatch(fetchingLatLngError(error)))
  }
}

const initialState = fromJS({
  isFetchingLatLng:false,
  isRecording: false,
  isCapturing: false,
  isUploading: false,
  currentCommuteId:'',
  latestLocation:{
    lat: 0,
    lng: 0,
  },
  latestFetchAttempt:0,
  latestFetch:0,
  error:'',
})

export default function record(state=initialState,action){
  switch (action.type) {
    case STOP_RECORDING:
      return state.merge({
        isRecording:false,
        currentCommuteId: '',
      })
    case START_RECORDING:
      return state.merge({
        isRecording:true,
        currentCommuteId: action.commuteId,
      })
    case UPLOADING_CLIP:
      return state.set('isUploading',true)
    case UPLOADING_CLIP_SUCCESS:
      return state.set('isUploading',false)
    case FETCHING_LATLNG:
      return state.merge({
        isFetchingLatLng:true,
        latestFetchAttempt:Date.now(),
      })
    case UPLOADING_CLIP_ERROR:
    case RECORD_ERROR:
    case FETCHING_LATLNG_ERROR:
      return state.merge({
        isRecording:false,
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