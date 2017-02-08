import {initialState as baseState } from 'config/constants'
import { fromJS } from 'immutable'
import { fetchUserSettings, updateUserSettings } from 'helpers/api'

const FETCHING_USER_SETTINGS = 'FETCHING_USER_SETTINGS'
const FETCHING_USER_SETTINGS_ERROR = 'FETCHING_USER_SETTINGS_ERROR'
const FETCHING_USER_SETTINGS_SUCCESS = 'FETCHING_USER_SETTINGS_SUCCESS'
const UPDATE_USER_TARGET_FREQUENCY = 'UPDATE_USER_TARGET_FREQUENCY'
const TOGGLE_CALIBRATION = 'TOGGLE_CALIBRATION'

function fetchingUserSettings () {
  return {
    type:FETCHING_USER_SETTINGS,
  }
}

function fetchingUserSettingsError (error) {
  console.error(error)
  return {
    type:FETCHING_USER_SETTINGS_ERROR,
    error : 'error fetching User\'s settings',
  }
}

function fetchingUserSettingsSuccess (uid,settings) {
  return {
    type:FETCHING_USER_SETTINGS_SUCCESS,
    uid,
    settings
  }
}

function updateUserTargetFrequency (uid,frequency){
  return {
    type:UPDATE_USER_TARGET_FREQUENCY,
    uid,
    frequency,
  }
}

export  function toggleCalibration (){
  return {
    type:TOGGLE_CALIBRATION,
  }
}

// this returns a promise 
export function handleFetchingUserSettings (uid) {
  return function (dispatch) {
    dispatch(fetchingUserSettings())
    return fetchUserSettings(uid)
      .then((settings)=>dispatch(fetchingUserSettingsSuccess(uid,settings)))
      .catch((error)=>dispatch(fetchingUserSettingsError(error)))
  }
}

export function handleUpdateTargetFrequency(uid,frequency){
  return function (dispatch) {
    return updateUserSettings(uid,'targetFrequency',frequency)
    .then(()=>dispatch(updateUserTargetFrequency(uid,frequency)))
    .catch((error)=>dispatch(fetchingUserSettingsError(error)))
  }
}

const initialSettingState = fromJS({
  useRingBells : true,
  targetFrequency : 3000,
})

function settings (state = initialSettingState, action) {
  switch (action.type) {
    case FETCHING_USER_SETTINGS_SUCCESS:
      return state.merge(action.settings)
    case UPDATE_USER_TARGET_FREQUENCY:
      return state.set('targetFrequency',action.frequency)
    default:
      return state
  }
}

const initialState = baseState.merge({
  isCalibrating:false,
})

export default function userSettings (state = initialState, action) {
  switch (action.type) {
    case FETCHING_USER_SETTINGS:
      return state.set('isFetching',true)
    case FETCHING_USER_SETTINGS_ERROR:
      return state.merge({
        isFetching:false,
        error:action.error
      })
    case FETCHING_USER_SETTINGS_SUCCESS:
      return state.merge({
        isFetching:false,
        [action.uid]:settings(state.get(action.uid),action)
      })
    case UPDATE_USER_TARGET_FREQUENCY:
      return state.set(action.uid,settings(state.get(action.uid),action))
    case TOGGLE_CALIBRATION:
      return state.merge({
        isCalibrating: !state.get('isCalibrating')
      })
    default:
      return state
  }
}
