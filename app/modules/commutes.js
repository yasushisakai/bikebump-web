import { fromJS } from 'immutable'
const FETCHING_COMMUTES = 'FETCHING_COMMUTES'
const FETCHING_COMMUTES_ERROR = 'FETCHING_COMMUTES_ERROR'
const FETCHING_COMMUTES_SUCCESS = 'FETCHING_COMMUTES_SUCCESS'

const ADD_COMMUTE = 'ADD_COMMUTE'
const ADD_MULTIPLE_COMMUTES = 'ADD_MULTIPLE_COMMUTES'

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

function fetchingCommutesSuccess (commute) {
  return {
    type:FETCHING_COMMUTES_SUCCESS,
    commute
  }
}

function addCommute (commute) {
  return{
    type:ADD_COMMUTE,
    commute,
  }
}

function addMultipleCommutes (commutes){
  return{
    type:ADD_MULTIPLE_COMMUTES,
    commutes,
  }
}

const initalState = fromJS({
  isFetching:false,
  error:'',
})

export default function commutes(state=initalState,action){
  switch(action.type){
    case FETCHING_COMMUTES:
      return state.merge({
        isFetching:true,
      })
    case FETCHING_COMMUTES_ERROR:
      return state.merge({
        isFetching:false,
        error
      })
    case ADD_COMMUTE:
    case FETCHING_COMMUTES_SUCCESS:
      return state.merge({
        isFetching:false,
        error:'',
        [action.commute.commuteId]:commute
      })
    case ADD_MULTIPLE_COMMUTES:
      return state.merge(action.commutes)
    default:
      return state
  }
}