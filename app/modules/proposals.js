import { fromJS,List } from 'immutable'
import { save, saveProposal, fetchAll } from 'helpers/api'
import { initialState } from 'config/constants'

const FETCHING_PROPOSALS = 'FETCHING_PROPOSALS'
const FETCHING_PROPOSALS_ERROR = 'FETCHING_PROPOSALS_ERROR'
const FETCHING_PROPOSALS_SUCCESS = 'FETCHING_PROPOSALS_SUCCESS'

const ADD_PROPOSAL = 'ADD_PROPOSAL'
const ADD_PROPOSAL_ERROR = 'ADD_PROPOSAL_ERROR'

const ADD_VOTE = 'ADD_VOTE'
const REMOVE_VOTE = 'REMOVE_VOTE'


function fetchingProposals() {
  return {
    type: FETCHING_PROPOSALS
  }
}

function fetchingProposalsError(error) {
  console.warn(error)
  return {
    type: FETCHING_PROPOSALS_ERROR,
    error : 'error fething proposals'
  }
}

function fetchingProposalsSuccess(proposals) {
  return {
    type: FETCHING_PROPOSALS_SUCCESS,
    proposals
  }
}

function addProposal(proposal){
  return {
    type:ADD_PROPOSAL,
    proposal
  }
}

function addProposalError(error){
  console.warn(error)
  return {
    type:ADD_PROPOSAL_ERROR,
    error : 'error adding proposal'
  }
}

export function handleFetchingProposals () {
  return function(dispatch) {
    dispatch(fetchingProposals())
    fetchAll('proposals')
      .then((proposals)=>dispatch(fetchingProposalsSuccess(proposals)))
      .catch((error)=>dispatch(fetchingProposalsError(error)))
  }
}

export function handleAddProposal (proposal) {
  return function(dispatch) {
    saveProposal(proposal)
      .then((proposalWithId)=>dispatch(addProposal(proposalWithId)))
      .catch((error)=>dispatch(addProposalError(error)))
  }
}

export function addVote (uid,roadId,proposalId) {
  return {
    type:ADD_VOTE,
    roadId,
    proposalId,
    uid,
  }
}

export function removeVote(uid,roadId,proposalId) {
  return {
    type:REMOVE_VOTE,
    roadId,
    proposalId,
    uid,
  }
}


export default function proposals (state=initialState, action){
  switch (action.type) {
    case FETCHING_PROPOSALS:
      return state.set('isFetching',true)
    case ADD_PROPOSAL_ERROR:
    case FETCHING_PROPOSALS_ERROR:
      return state.merge({
        isFetching:false,
        error:action.error
      })
    case FETCHING_PROPOSALS_SUCCESS:
      return state.merge({
        isFetching:false,
        error:''
      }).merge(action.proposals)
    case ADD_PROPOSAL:
      return state.setIn([action.proposal.roadId,action.proposal.proposalId],action.proposal)
    case ADD_VOTE:
      return state.setIn([`${action.roadId}`,action.proposalId,action.uid],true)
    case REMOVE_VOTE:
      return state.deleteIn([`${action.roadId}`,action.proposalId,action.uid])
    default:
      return state
      break;
  }
}