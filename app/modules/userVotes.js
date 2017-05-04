import { initialState } from 'config/constants'
import { fromJS, toJS, Map } from 'immutable'
import { addVote, removeVote, overwriteVote } from 'modules/proposals'
import { getDomainLength, getTotalLength } from 'helpers/utils'
import { saveVote, deleteVote, fetchUserVotes } from 'helpers/api'

const FETCHING_USER_VOTES = 'FETCHING_USER_VOTES'
const REMOVE_FETCHING_USER_VOTES = 'REMOVE_FETCHING_USER_VOTES'
const FETCHING_USER_VOTES_ERROR = 'FETCHING_USER_VOTES_ERROR'
const FETCHING_USER_VOTES_SUCCESS = 'FETCHING_USER_VOTES_SUCCESS'

export const ADD_USER_VOTE = 'ADD_USER_VOTE'
export const REMOVE_USER_VOTE = 'REMOVE_USER_VOTE'

function fetchingUserVotes () {
  return {
    type: FETCHING_USER_VOTES,
  }
}

function removeFetchingUserVotes () {
  return {
    type: REMOVE_FETCHING_USER_VOTES,
  }
}

function fetchingUserVotesError (error) {
  console.warn(error)
  return {
    type: FETCHING_USER_VOTES_ERROR,
    error: 'error fetching user votes',
  }
}

function fetchingUserVotesSuccess (uid, votes) {
  return {
    type: FETCHING_USER_VOTES_SUCCESS,
    uid,
    votes,
  }
}

function addUserVote (uid, vote) {
  return {
    type: ADD_USER_VOTE,
    uid,
    vote,
  }
}

function removeUserVote (uid, vote) {
  return {
    type: REMOVE_USER_VOTE,
    uid,
    vote,
  }
}

export function handleFetchingUserVotes (uid) {
  return function (dispatch, getState) {
    dispatch(fetchingUserVotes())
    fetchUserVotes(uid)
      .then((UserVotes) => dispatch(fetchingUserVotesSuccess(uid, UserVotes)))
      .catch((error) => dispatch(fetchingUserVotesError(error)))
  }
}

export function handleAddVote (uid, roadId, proposalId) {
  console.log(uid, roadId, proposalId)
  return function (dispatch, getState) {
    // check if there is already a vote for uid - pair
    const previousVote = getState().userVotes.getIn([uid, `${roadId}`])

    if (previousVote !== undefined) {
      deleteVote(uid, roadId, previousVote)
        .then(() => dispatch(removeUserVote(uid, {uid, roadId, proposalId: previousVote})))
        .then(() => saveVote(uid, roadId, proposalId))
        .then(() => dispatch(addUserVote(uid, {uid, roadId, proposalId})))
        .catch(error => dispatch(fetchingUserVotesError(error)))
    } else {
      saveVote(uid, roadId, proposalId)
      .then(() => dispatch(addUserVote(uid, {uid, roadId, proposalId})))
      .catch(error => dispatch(fetchingUserVotesError(error)))
    }
  }
}

export function handleRemoveVote (uid, roadId, proposalId) {
  return function (dispatch, getState) {
    deleteVote(uid, roadId, proposalId)
        .then(() => dispatch(removeUserVote(uid, {uid, roadId, proposalId})))
        .catch((error) => dispatch(fetchingUserVotesError(error)))
  }
}

export default function UserVotes (state = initialState, action) {
  switch (action.type) {
    case FETCHING_USER_VOTES:
      return state.set('isFetching', true)
    case REMOVE_FETCHING_USER_VOTES:
      return state.set('isFetching', false)
    case FETCHING_USER_VOTES_ERROR:
      return state.merge({
        isFetching: false,
        error: action.error,
      })
    case FETCHING_USER_VOTES_SUCCESS:
      return state.merge({
        isFetching: false,
        error: '',
        [action.uid]: action.votes,
      })
    case ADD_USER_VOTE:
      return state.setIn([action.uid, `${action.vote.roadId}`], action.vote.proposalId)
    case REMOVE_USER_VOTE:
      return state.setIn([action.uid, `${action.vote.roadId}`], undefined)
    default:
      return state
      break
  }
}
