import { fromJS } from 'immutable'
import { fetchCommutes, saveCommute } from 'helpers/api'
const FETCHING_COMMUTES = 'FETCHING_COMMUTES'
const FETCHING_COMMUTES_ERROR = 'FETCHING_COMMUTES_ERROR'
const FETCHING_COMMUTES_SUCCESS = 'FETCHING_COMMUTES_SUCCESS'

const ADD_COMMUTE = 'ADD_COMMUTE'
const ADD_COMMUTE_ERROR = 'ADD_COMMUTE_ERROR'

function fetchingCommutes () {
  return {
    type:FETCHING_COMMUTES,
  }
}

function fetchingCommutesError (error) {
  console.warn(error)
  return {
    type : FETCHING_COMMUTES_ERROR,
    error : 'error fetching commutes'
  }
}

function fetchingCommutesSuccess (commutes) {
  return {
    type:FETCHING_COMMUTES_SUCCESS,
    commutes
  }
}

export function handleFetchCommutes () {
  return function (dispatch) {
    dispatch(fetchingCommutes())
    fetchCommutes()
      .then((commutes)=>dispatch(fetchingCommutesSuccess(commutes)))
      .catch((error)=>dispatch(fetchingCommutesError(error)))
  }
}

export function addCommute (commute) {
  return{
    type:ADD_COMMUTE,
    commute,
  }
}

function addCommuteError (error){
  console.warn(error)
  return {
    type:ADD_COMMUTE_ERROR,
    error : 'error adding commute'
  }
}

export function handleAddCommute (commute) {
  return function (dispatch) {
    dispatch(fetchingCommutes)
    saveCommute(commute)
      .then((commuteWithId)=>dispatch(addCommute(commuteWithId)))
      .catch((error)=>dispatch(addCommuteError(error)))
  }
}

const initalState = fromJS({
  isFetching:true,
  error:'',
})

export default function commutes(state=initalState,action){
  switch(action.type){
    case FETCHING_COMMUTES:
      return state.merge({
        isFetching:true,
      })
    case ADD_COMMUTE_ERROR:
    case FETCHING_COMMUTES_ERROR:
      return state.merge({
        isFetching:false,
        error
      })
    case FETCHING_COMMUTES_SUCCESS:
      return state.merge({
        isFetching:false,
        error:'',
      }).merge(action.commutes)
    case ADD_COMMUTE:
      return state.merge({
        [action.commute.commuteId]:action.commute
      })
    default:
      return state
  }
}