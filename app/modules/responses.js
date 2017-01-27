import { initialState } from 'config/constants'
import { fetchAll, saveResponse } from 'helpers/api'

const FETCHING_RESPONSES = 'FETCHING_RESPONSES'
const FETCHING_RESPONSES_ERROR = 'FETCHING_RESPONSES_ERROR'
const FETCHING_RESPONSES_SUCCESS = 'FETCHING_RESPONSES_SUCCESS'

const ADD_RESPONSE = 'ADD_RESPONSE'
const ADD_RESPONSE_ERROR = 'ADD_RESPONSE_ERROR'


function fetchingResponses () {
  return{
    type:FETCHING_RESPONSES,
  }
}

function fetchingResponsesError (error) {
  console.warn(error)
   return{
    type:FETCHING_RESPONSES_ERROR,
    error: 'error fetching responses'
  }
}

function fetchingResponsesSuccess (responses) {
   return{
    type:FETCHING_RESPONSES_SUCCESS,
    responses
  }
} 

export function handleFetchingResponses(){
  return function (dispatch) {
    dispatch(fetchingResponses())
    fetchAll('responses')
      .then((responses)=>dispatch(fetchingResponsesSuccess(responses)))
      .catch((error)=>dispatch(fetchingResponsesError(error)))
  }
}

function addResponse (response) {
  return{
    type:ADD_RESPONSE,
    response
  }
}

function addResponseError (error) {
  console.warn(error)
  return{
    type:ADD_RESPONSE_ERROR,
    error:'error adding Response'
  }
}

export function handleAddResponse (response) {
  return function(dispatch) {
    saveResponse(response)
      .then((responseWithId)=>dispatch(addResponse(responseWithId)))
      .catch((error)=>dispatch(addResponseError(error)))
  }
}

export default function responses (state=initialState, action){
  switch (action.type) {
    case FETCHING_RESPONSES:
      return state.set('isFetching',true)
    case FETCHING_RESPONSES_SUCCESS:
      return state.merge({
        isFetching:false,
        error:''
      }).merge(action.responses)
    case ADD_RESPONSE_ERROR:
    case FETCHING_RESPONSES_ERROR:
      return state.merge({
        isFetching:false,
        erro:action.error
      })
    case ADD_RESPONSE:
      return state.merge({
        isFetching:false,
        error:'',
        [action.response.responseId]:action.response
      })
    default:
      return state
  }
}