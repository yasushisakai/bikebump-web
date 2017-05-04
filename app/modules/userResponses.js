import { Map, fromJS } from 'immutable'
import { initialState as baseState } from 'config/constants'
import { isModuleStale } from 'helpers/utils'
import { ADD_RESPONSE, ADD_RESPONSE_ERROR } from 'modules/responses'
import {fetchUserResponses} from 'helpers/api'

const FETCHING_USER_RESPONSES = 'FETCHING_USER_RESPONSES'
const FETCHING_USER_RESPONSES_ERROR = 'FETCHING_USER_RESPONSES_ERROR'
const FETCHING_USER_RESPONSES_SUCCESS = 'FETCHING_USER_RESPONSES_SUCCESS'

const USER_RESPONSE_ERROR = 'USER_RESPONSE_ERROR'
// const ADD_USER_RESPONSE = 'ADD_USER_RESPONSE'

const SET_NEXT_QUERY = 'SET_NEXT_QUERY'
const SET_HAS_UNANSWERED = 'SET_HAS_UNANSWERED'

function fetchingUserResponses () {
  return {
    type: FETCHING_USER_RESPONSES,
  }
}

function fetchingUserResponsesError (error) {
  console.warn(error)
  return {
    type: FETCHING_USER_RESPONSES_ERROR,
    error: 'error fetching user response',
  }
}

function fetchingUserResponsesSuccess (uid, responses) {
  return {
    type: FETCHING_USER_RESPONSES_SUCCESS,
    uid,
    responses,
  }
}

export function setNextQuery (dingId, questionId) {
  return {
    type: SET_NEXT_QUERY,
    dingId,
    questionId,
  }
}

export function setHasUnanswered (hasUnanswered) {
  return {
    type: SET_HAS_UNANSWERED,
    hasUnanswered,
  }
}

// export function addUserResponse (uid,response){
//   const {questionId,responseId,dingId} = response
//   return {
//     type: ADD_USER_RESPONSE,
//     uid,
//     dingId,
//     questionId,
//     responseId,
//   }
// }

export function handleFetchingUserResponses (uid) {
  return function (dispatch, getState) {
    if (getState().userResponses.get('isFetching')) {
      return Promise.resolve(null)
    }

    if (!isModuleStale(getState().userResponses.get('lastUpdated'))) {
      return Promise.resolve(getState().userResponses.get(uid))
    }

    dispatch(fetchingUserResponses())
    return fetchUserResponses(uid)
        .then((response) => {
          return response
        })
        .then((responses) => dispatch(fetchingUserResponsesSuccess(uid, responses)))
        .catch((error) => dispatch(fetchingUserResponsesError(error)))
  }
}

const initialNextPair = new Map({
  dingId: '',
  questionId: '',
})

let initialState = baseState.set('nextPair', initialNextPair)
initialState = initialState.set('hasUnanswered', false)

export default function userResponses (state = initialState, action) {
  switch (action.type) {
    case FETCHING_USER_RESPONSES:
      return state.set('isFetching', true)
    case FETCHING_USER_RESPONSES_ERROR:
    case ADD_RESPONSE_ERROR:
      return state.merge({
        isFetching: false,
        error: action.error,
      })
    case FETCHING_USER_RESPONSES_SUCCESS:
      return state.merge({
        isFetching: false,
        error: '',
        [action.uid]: action.responses,
      })
    case SET_NEXT_QUERY:
      return state.setIn(['nextPair', 'dingId'], action.dingId).setIn(['nextPair', 'questionId'], action.questionId)
    case SET_HAS_UNANSWERED:
      return state.set('hasUnanswered', action.hasUnanswered)
    case ADD_RESPONSE:
      const { uid, dingId, questionId, responseId, value } = action.response
      return state.setIn([ uid, dingId, questionId, responseId ], value)
    default:
      return state
  }
}
