import { fromJS,List } from 'immutable'
import { save, saveProposal, fetchPropsals  } from 'helpers/api'
import { initialState } from 'config/constants'
import {ADD_USER_VOTE,REMOVE_USER_VOTE} from 'modules/userVotes'

const FETCHING_PROPOSALS = 'FETCHING_PROPOSALS'
const FETCHING_PROPOSALS_ERROR = 'FETCHING_PROPOSALS_ERROR'
const FETCHING_PROPOSALS_SUCCESS = 'FETCHING_PROPOSALS_SUCCESS'

const ADD_PROPOSAL = 'ADD_PROPOSAL'
const ADD_PROPOSAL_ERROR = 'ADD_PROPOSAL_ERROR'


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

function fetchingProposalsSuccess(roadId,proposals) {
  return {
    type: FETCHING_PROPOSALS_SUCCESS,
    roadId,
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

export function handleFetchingProposals (roadId) {
  return function(dispatch) {
    dispatch(fetchingProposals())
    return fetchPropsals(roadId)
      .then((proposals)=>dispatch(fetchingProposalsSuccess(roadId,proposals)))
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

const initialProposalState = fromJS({
  domain :{},
  proposalId:'',
  votes:{},
  patternId: '',
  roadId: '',
})

function proposal(state=initialProposalState,action){
  switch(action.type){
    case ADD_USER_VOTE:
      return state.setIn(['votes',action.vote.uid],true)
    case REMOVE_USER_VOTE:
      console.log(action)
      return state.deleteIn(['votes',action.vote.uid])
    default:
      return state
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
        error:'',
        [action.roadId]:action.proposals,
      })
    case ADD_PROPOSAL:
      return state.setIn([action.proposal.roadId,action.proposal.proposalId],action.proposal)
    case ADD_USER_VOTE:
    case REMOVE_USER_VOTE:
      return state.setIn([`${action.vote.roadId}`,action.vote.proposalId],proposal(state.getIn([`${action.vote.roadId}`,action.vote.proposalId]),action))
    default:
      return state
      break;
  }
}