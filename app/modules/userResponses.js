import { initialState } from 'config/constants'
import { ADD_RESPONSE, ADD_RESPONSE_ERROR } from 'modules/responses'
import {fetchUserResponses} from 'helpers/api'

const FETCHING_USER_RESPONSES = 'FETCHING_USER_RESPONSES'
const FETCHING_USER_RESPONSES_ERROR = 'FETCHING_USER_RESPONSES_ERROR'
const FETCHING_USER_RESPONSES_SUCCESS = 'FETCHING_USER_RESPONSES_SUCCESS'

const USER_RESPONSE_ERROR = 'USER_RESPONSE_ERROR'


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

export function handleFetchingUserResponses (uid){
  return function(dispatch,getState){
    // const uid = getState().users.get('authedId')
    dispatch(fetchingUserResponses())
      fetchUserResponses(uid)
        .then((response)=>{
          return response
        })
        .then((responses)=>dispatch(fetchingUserResponsesSuccess(uid,responses)))
        .catch((error)=>dispatch(fetchingUserResponsesError(error)))
  }
}

export default function userResponses(state = initialState,action){
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
        isFetching:true,
        error:'',
        [action.uid]:action.responses
      })
    case ADD_RESPONSE:
      const {uid,dingId,questionId,responseId,value} = action.response
      return state.setIn([uid,dingId,questionId,responseId],value)
    default:
      return state
  }
}