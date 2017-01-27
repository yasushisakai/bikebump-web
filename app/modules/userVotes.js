import { initialState } from 'config/constants'

const FETCHING_USER_VOTES = 'FETCHING_USER_VOTES'
const FETCHING_USER_VOTES_ERROR = 'FETCHING_USER_VOTES_ERROR'
const FETCHING_USER_VOTES_SUCCESS = 'FETCHING_USER_VOTES_SUCCESS'

function fetchingUserVotes () {
  return {
    type:FETCHING_USER_VOTES,
  }
}

function fetchingUserVotesError (error) {
  return {
    type: FETCHING_USER_VOTES_ERROR,
    error: 'error fetching user votes'
  }
}

function fetchingUserVotesSuccess (userVotes) {
  return {
    type: FETCHING_USER_VOTES_SUCCESS,
    userVotes
  }
}

export function handleFetchingUserVotes (uid) {
  return function (dispatch) {
    dispatch(fetchingUserVotes)
    
  }
}