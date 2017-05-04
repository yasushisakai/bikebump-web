import { fromJS, toJS, Map } from 'immutable'
import { createDing, fetchDings, fetchDing, createUserDing } from 'helpers/api'
import { addUserDing } from 'modules/userDings'
import { distFromLatLng } from 'helpers/utils'
import { addDingId } from 'modules/dingFeed'

const FETCHING_DINGS = 'FETCHING_DINGS'
const FETCHING_SINGLE_DING = 'FETCHING_SINGLE_DING'
const FETCHING_DINGS_ERROR = 'FETCHING_DINGS_ERROR'
export const FETCHING_DING_SUCCESS = 'FETCHING_DING_SUCCESS'
const FETCHING_DINGS_SUCCESS = 'FETCHING_DINGS_SUCCESS'
const REMOVE_FETCHING = 'REMOVE_FETCHING'
const ADD_MULTIPLE_DINGS = 'ADD_MULTIPLE_DINGS'

function fetchingDings () {
  return {
    type: FETCHING_DINGS,
  }
}

function fetchingSingleDing () {
  return {
    type: FETCHING_SINGLE_DING,
  }
}

function fetchingDingsError (error) {
  console.warn(error)
  return {
    type: FETCHING_DINGS_ERROR,
    error: 'error fetching dings',
  }
}

function fetchingDingsSuccess (dings) {
  return {
    type: FETCHING_DINGS_SUCCESS,
    dings,
  }
}

function fetchingDingSuccess (dingId, ding) {
  return {
    type: FETCHING_DING_SUCCESS,
    dingId,
    ding,
  }
}

export function handleFetchingDings () {
  return function (dispatch) {
    dispatch(fetchingDings())
    return fetchDings()
      .then(dings => dispatch(fetchingDingsSuccess(dings)))
      .catch(error => dispatch(fetchingDingsError(error)))
  }
}

export function handleFetchingDing (dingId) {
  return function (dispatch, getState) {
    if (getState().dings.has(dingId)) {
      return Promise.resolve(getState().dings.get(dingId))
    }

    dispatch(fetchingSingleDing())
    return fetchDing(dingId)
      .then(ding => dispatch(fetchingDingSuccess(dingId, ding)))
      .then(() => {
        if (!getState().dingFeed.get('dingIds').has(dingId)) {
          dispatch(addDingId(dingId))
        }
      })
      .catch(error => dispatch(fetchingDingsError(error)))
  }
}

export function removeFetching () {
  return {
    type: REMOVE_FETCHING,
  }
}

export function addMultipleDings (dings) {
  return {
    type: ADD_MULTIPLE_DINGS,
    dings,
  }
}

//
// this creates or append (a timestamp to an existing ding)
// ding, updates the server, the state will be notified by the listener(dingFeed)
// + it adds (to both FB and state) and userDing with the status of 'DINGED'
//
export function handleComplieDing (uid, coordinates, timestamp, radius, value) {
  return function (dispatch, getState) {
    return createDing(coordinates.lat, coordinates.lng, uid, timestamp, value)
      .then(dingId => createUserDing(uid, dingId))
      .then(response => {
        const {uid, dingId, status} = response
        return dispatch(addUserDing(uid, dingId, status))
      })
  }
}

const initialState = fromJS({
  lastUpdated: 0,
  isFetching: false,
  error: '',
})

export default function dings (state = initialState, action) {
  switch (action.type) {
    case FETCHING_DINGS:
    case FETCHING_SINGLE_DING:
      return state.merge({
        isFetching: true,
      })
    case FETCHING_DINGS_ERROR:
      return state.merge({
        isFetching: false,
        error: action.error,
      })
    case FETCHING_DING_SUCCESS:
      return state.merge({
        isFetching: false,
        [action.dingId]: action.ding,
      })
    case FETCHING_DINGS_SUCCESS:
      return state.merge({
        isFetching: false,
      }).merge(action.dings)
    case REMOVE_FETCHING:
      return state.set('isFetching', false)
    case ADD_MULTIPLE_DINGS:
      return state.merge(action.dings)
    default:
      return state
  }
}
