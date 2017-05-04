import { fromJS } from 'immutable'
import { listenToDings } from 'helpers/api'
import { addListener } from 'modules/listeners'
import { addMultipleDings, removeFetching } from 'modules/dings'

const SETTING_DING_LISTENER = 'SETTING_DING_LISTENER'
const SETTING_DING_LISTENER_ERROR = 'SETTING_DING_LISTENER_ERROR'
const SETTING_DING_LISTENER_SUCCESS = 'SETTING_DING_LISTENER_SUCCESS'
const REMOVE_FETCHING_DING_FEED = 'REMOVE_FETCHING_DING_FEED'
const ADD_DING_ID = 'ADD_DING_ID'

function settingDingListener () {
  return {
    type: SETTING_DING_LISTENER,
  }
}

function settingDingListenerError (error) {
  console.log(error)
  return {
    type: SETTING_DING_LISTENER_ERROR,
    error: 'error setting ding listener',
  }
}

function settingDingListenerSuccess (dingIds) {
  return {
    type: SETTING_DING_LISTENER_SUCCESS,
    dingIds,
  }
}

function removeFetchingDingFeed () {
  return {
    type: REMOVE_FETCHING_DING_FEED,
  }
}

export function addDingId (dingId) {
  return {
    type: ADD_DING_ID,
    dingId,
  }
}

export function handleSetDingListener () {
  return function (dispatch, getState) {
    // if already fetching, forget it
    if (getState().dingFeed.get('isFetching')) return

    dispatch(settingDingListener())

    // we were already listening the feed!
    if (getState().listeners.get('dings') === true) {
      return Promise.resolve(dispatch(removeFetchingDingFeed()))
    }

    dispatch(addListener('dings'))

    return listenToDings((dings) => {
      dispatch(addMultipleDings(dings))
      dispatch(removeFetching())
      dispatch(settingDingListenerSuccess(Object.keys(dings)))
    },
      (error) => dispatch(settingDingListenerError(error)))
  }
}

const initialState = fromJS({
  isFetching: false,
  error: '',
  dingIds: [],
})

export default function dingFeed (state = initialState, action) {
  switch (action.type) {
    case SETTING_DING_LISTENER:
      return state.merge({
        isFetching: true,
      })
    case SETTING_DING_LISTENER_ERROR:
      return state.merge({
        isFetching: false,
        error: action.error,
      })
    case SETTING_DING_LISTENER_SUCCESS:
      return state.merge({
        isFetching: false,
        error: '',
        dingIds: action.dingIds,
      })
    case ADD_DING_ID:
      return state.set('dingIds', state.get('dingIds').push(action.dingId))
    case REMOVE_FETCHING_DING_FEED:
      return state.set('isFetching', false)
    default:
      return state
  }
}
