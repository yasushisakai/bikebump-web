import { initialState } from 'config/constants'
import { checkLastUpdate } from 'helpers/utils'
import { ADD_RESPONSE, ADD_RESPONSE_ERROR } from 'modules/responses'
import {fetchUserResponses} from 'helpers/api'

const FETCHING_USER_RESPONSES = 'FETCHING_USER_RESPONSES'
const FETCHING_USER_RESPONSES_ERROR = 'FETCHING_USER_RESPONSES_ERROR'
const FETCHING_USER_RESPONSES_SUCCESS = 'FETCHING_USER_RESPONSES_SUCCESS'

const USER_RESPONSE_ERROR = 'USER_RESPONSE_ERROR'
// const ADD_USER_RESPONSE = 'ADD_USER_RESPONSE'

const SET_NEXT_RESPONSE = 'SET_NEXT_RESPONSE'
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
  error: 'error fetching user response'
  }
}


function fetchingUserResponsesSuccess (uid,responses) {
 return {
  type: FETCHING_USER_RESPONSES_SUCCESS,
  uid,
  responses
  }
}

export function setNextResponse(pair){
  return {
    type:SET_NEXT_RESPONSE,
    pair,
  }
}

export function setHasUnanswered(hasUnanswered){
  return {
    type:SET_HAS_UNANSWERED,
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

export function handleFetchingUserResponses (uid){
  return function(dispatch,getState){
    if(!checkLastUpdate(getState().userResponses.get('lastUpdated'))){
      return Promise.resolve(getState().userResponses.get(uid))
    }
    dispatch(fetchingUserResponses())
      return fetchUserResponses(uid)
        .then((response)=>{
          return response
        })
        .then((responses)=>dispatch(fetchingUserResponsesSuccess(uid,responses)))
        .catch((error)=>dispatch(fetchingUserResponsesError(error)))
  }
}

export default function userResponses(state = initialState.set('nextResponsePair',[]).set('hasUnanswered',false),action){
  switch (action.type) {
    case FETCHING_USER_RESPONSES:
      return state.set('isFetching',true)
    case FETCHING_USER_RESPONSES_ERROR:
    case ADD_RESPONSE_ERROR:
      return state.merge({
        isFetching:false,
        error: action.error
      })
    case FETCHING_USER_RESPONSES_SUCCESS:
      return state.merge({
        isFetching:false,
        error:'',
        [action.uid]:action.responses
      })
    case SET_NEXT_RESPONSE:
      return state.set('nextResponsePair',action.pair)
    case SET_HAS_UNANSWERED:
      return state.set('hasUnanswered',action.hasUnanswered)
    case ADD_RESPONSE:
      const {uid,dingId,questionId,responseId,value} = action.response
      return state.setIn([uid,dingId,questionId,responseId],value)
    default:
      return state
  }
}