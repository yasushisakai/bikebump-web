import { initialState } from 'config/constants'
import { fromJS, toJS, Map } from 'immutable' 
import { addVote, removeVote, overwriteVote } from 'modules/proposals'
import { getDomainLength, getTotalLength } from 'helpers/utils'
import { saveVote, deleteVote, fetchUserVotes } from 'helpers/api'

const FETCHING_USER_VOTES = 'FETCHING_USER_VOTES'
const REMOVE_FETCHING_USER_VOTES = 'REMOVE_FETCHING_USER_VOTES'
const FETCHING_USER_VOTES_ERROR = 'FETCHING_USER_VOTES_ERROR'
const FETCHING_USER_VOTES_SUCCESS = 'FETCHING_USER_VOTES_SUCCESS'

const SET_USER_CREDITS = 'SET_USER_CREDITS'
const ADD_USER_CREDITS = 'ADD_USER_CREDITS'
const REMOVE_USER_CREDITS = 'REMOVE_USER_CREDITS'

const ADD_USER_VOTE = 'ADD_USER_VOTE'
const REMOVE_USER_VOTE = 'REMOVE_USER_VOTE'

function fetchingUserVotes () {
  return {
    type:FETCHING_USER_VOTES
  }
}

function removeFetchingUserVotes () {
  return {
    type:REMOVE_FETCHING_USER_VOTES
  }
}

function fetchingUserVotesError (error) {
  console.warn('error')
  return {
      type:FETCHING_USER_VOTES_ERROR,
      error:'error fetching user votes'
  }
}

function fetchingUserVotesSuccess (uid,votes) {
  return {
    type: FETCHING_USER_VOTES_SUCCESS,
    uid,
    votes
  }
}

export function handleFetchingUserVotes () {
  return function (dispatch,getState) {
    const uid = getState().users.get('authedId')
    dispatch(fetchingUserVotes())
    fetchUserVotes(uid)
      .then((votes)=>{
        let newVote;
        if(votes.credits === undefined){
          newVote = {...votes,credits:100}
        }else{
          newVote = votes
        }
        return newVote
      })
      .then((UserVotes)=>dispatch(fetchingUserVotesSuccess(uid,UserVotes)))
      .catch((error)=>dispatch(fetchingUserVotesError(error)))
  }
}

function setUserCredits (uid,value) {
  console.log('setUserCredits',value)
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
    value,
  }
}

function removeUserCredits (uid,value) {
  return {
    type:REMOVE_USER_CREDITS,
    uid,
    value,
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

function getCredit(getState,roadId,proposalId) {
  const road_geometry = getState().roads.getIn([`${roadId}`,'geometry'])
  console.log(proposalId)
  const proposal = getState().proposals.getIn([`${roadId}`,proposalId])
  const unitBudget = getState().patterns.getIn([proposal.get('patternId'),'budget'])

  return getDomainLength(road_geometry.toJS(),proposal.get('domain').toJS()) * unitBudget

}


export function handleVote(uid,roadId,proposalId){
  return function (dispatch,getState){
    dispatch(fetchingUserVotes)
    const currentCredit = getState().userVotes.getIn([uid,'credits']) || 100
    console.log(currentCredit)
    const credit = getCredit(getState,roadId,proposalId)

    const currentUserVoteForRoad = getState().userVotes.getIn([uid,`${roadId}`])

    if(currentUserVoteForRoad === null || currentUserVoteForRoad === undefined){ // add
      const newCredit = currentCredit + credit
      dispatch(setUserCredits(uid,newCredit))
      dispatch(addVote(uid,roadId,proposalId)) // adds to the proposals
      dispatch(addUserVote(uid,roadId,proposalId))
      saveVote(uid,roadId,proposalId,newCredit)
        .then(()=>dispatch(removeFetchingUserVotes()))
        .catch((error)=>dispatch(fetchingUserVotesError(error)))
    }else{
      if(currentUserVoteForRoad === proposalId){
        // remove
        const newCredit = currentCredit - credit
        dispatch(removeVote(uid,roadId,proposalId))
        dispatch(setUserCredits(uid,newCredit))
        dispatch(removeUserVote(uid,roadId,proposalId))
        deleteVote(uid,roadId,proposalId,newCredit)
          .then((dispatch)=>removeFetchingUserVotes())
          .catch((error)=>fetchingUserVotesError(error))
      }else{
        //replace
        const creditsToReplace = getCredit(getState,roadId,currentUserVoteForRoad)
        const newCredit = currentCredit - creditsToReplace + credit
        dispatch(setUserCredits(uid,newCredit))
        dispatch(removeVote(uid,roadId,currentUserVoteForRoad))
        dispatch(addVote(uid,roadId,proposalId))
        dispatch(addUserVote(uid,roadId,proposalId)) // this overwrites
        overwriteVote(uid,roadId,currentUserVoteForRoad,proposalId)
          .then((dispatch)=>removeFetchingUserVotes())
          .catch((error)=>fetchingUserVotesError(error))
      }
    }
  }
}

function removeUserVote (uid,roadId,proposalId) {
  return {
    type:REMOVE_USER_VOTE,
    uid,
    roadId,
    proposalId,
  }
}

const initialVoteState = fromJS({
  lastAction : 0,
  credits: 0,
})

function vote (state=initialVoteState, action) {
  switch (action.type) {
    case SET_USER_CREDITS:
      return state.set('credits',action.value)
    case ADD_USER_CREDITS:
      return state.set('credits',state.get('credits') + action.value)
    case REMOVE_USER_CREDITS:
      return state.set('credits',state.get('credits') - action.value)
    case ADD_USER_VOTE:
      return state.set(`${action.roadId}`,action.proposalId)
    case REMOVE_USER_VOTE:
      return state.delete(`${action.roadId}`)
    default:
      return state
  }
} 

export default function UserVotes (state=initialState, action) {
  switch (action.type) {
    case FETCHING_USER_VOTES:
      return state.set('isFetching',true)
    case REMOVE_FETCHING_USER_VOTES:
      return state.set('isFetching',false)
    case FETCHING_USER_VOTES_ERROR:
      return state.merge({
        isFetching:false,
        error:action.error
      })
    case FETCHING_USER_VOTES_SUCCESS:
      return state.merge({
        isFetching:false,
        error:'',
        [action.uid]:action.votes
      })
    case SET_USER_CREDITS:
    case ADD_USER_CREDITS:
    case REMOVE_USER_CREDITS:
    case ADD_USER_VOTE:
    case REMOVE_USER_VOTE:
      return state.set(action.uid,vote(state.get(action.uid),action))
    default:
      return state
      break;
  }
}