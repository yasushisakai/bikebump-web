import { initialState } from 'config/constants'
import { fromJS, toJS } from 'immutable' 
import { addVote, removeVote } from 'modules/proposals'
import { saveVote, deleteVote,fetchUserStats } from 'helpers/api'

const FETCHING_USER_STATS = 'FETCHING_USER_STATS'
const FETCHING_USER_STATS_ERROR = 'FETCHING_USER_STATS_ERROR'
const FETCHING_USER_STATS_SUCCESS = 'FETCHING_USER_STATS_SUCCESS'

const SET_USER_CREDITS = 'SET_USER_CREDITS'
const ADD_USER_CREDITS = 'ADD_USER_CREDITS'

const ADD_USER_VOTE = 'ADD_USER_VOTE'
const REMOVE_USER_VOTE = 'REMOVE_USER_VOTE'

function fetchingUserStats () {
  return {
    type:FETCHING_USER_STATS
  }
}

function fetchinUserStatsError (error) {
  console.warn('error')
  return {
      type:FETCHING_USER_STATS_ERROR,
      error:'error fetching user stats'
  }
}

function fetchingUserStatsSuccess (uid,stats) {
  return {
    type: FETCHING_USER_STATS_SUCCESS,
    uid,
    stats
  }
}

export function handleFetchingUserStats () {
  return function (dispatch,getState) {
    const uid = getState().users.get('authedId')
    console.log('uid',uid)
    dispatch(fetchingUserStats())
    fetchUserStats(uid)
      .then((userStats)=>dispatch(fetchingUserStatsSuccess(uid,userStats)))
      .catch((error)=>dispatch(fetchinUserStatsError(error)))
  }
}

function setUserCredits (uid,value) {
  return {
    type: SET_USER_CREDITS,
    uid,
    value
  }
}

function addUserCredits (uid,value) {
  return {
    type:ADD_USER_CREDITS,
    uid,
    value
  }
}

function addUserVote (uid,roadId,proposalId){
  return {
    type:ADD_USER_VOTE,
    uid,
    roadId,
    proposalId,
  }
}

export function handleAddVote(uid,roadId,proposalId){
  return function (dispatch) {
    saveVote(uid,roadId,proposalId)
      .then(()=>{
    dispatch(addVote(uid,roadId,proposalId)) // adds to the proposals
    dispatch(addUserVote(uid,roadId,proposalId))
      })
  }
}

export function handleRemoveVote(uid,roadId,proposalId){
  return function (dispatch) {
    deleteVote(uid,roadId,proposalId)
      .then(()=>{
        dispatch(removeVote(uid,roadId,proposalId))
        dispatch(removeUserVote(uid,roadId,proposalId))
      })
  }
}

function removeUserVote (uid,roadId,proposalId) {
  return {
    type:REMOVE_USER_VOTE,
    uid,
    roadId,
    proposalId
  }
}

const initialStatState = fromJS({
  lastAction : 0,
  credits: 0,
  userVotes: {}
})

function stats (state=initialStatState, action) {
  switch (action.type) {
    case SET_USER_CREDITS:
      return state.set('credits',action.value)
    case ADD_USER_CREDITS:
      const newValue = state.get('credits') + action.value
      return state.set('credits',newValue)
    case ADD_USER_VOTE:
      return state.setIn([`${action.roadId}`,action.proposalId],true)
    case REMOVE_USER_VOTE:
      return state.deleteIn([`${action.roadId}`,action.proposalId])
    default:
      return state
  }
} 

export default function userStats (state=initialState, action) {
  switch (action.type) {
    case FETCHING_USER_STATS:
      return state.set('isFetching',true)
    case FETCHING_USER_STATS_ERROR:
      return state.merge({
        isFetching:false,
        error:action.error
      })
    case FETCHING_USER_STATS_SUCCESS:
      return state.merge({
        isFetching:false,
        error:'',
        [action.uid]:action.stats
      })
    case SET_USER_CREDITS:
    case ADD_USER_CREDITS:
    case ADD_USER_VOTE:
    case REMOVE_USER_VOTE:
      return state.set(action.uid,stats(state.get(action.uid),action))
    default:
      return state
      break;
  }
}