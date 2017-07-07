import { fromJS } from 'immutable';
import { saveProposal, fetchProposals } from 'helpers/api';
// import {ADD_USER_VOTE, REMOVE_USER_VOTE} from 'modules/userVotes';
import { isModuleStale } from 'helpers/utils';

const FETCHING_PROPOSALS = 'FETCHING_PROPOSALS';
const FETCHING_PROPOSALS_ERROR = 'FETCHING_PROPOSALS_ERROR';
const FETCHING_PROPOSALS_SUCCESS = 'FETCHING_PROPOSALS_SUCCESS';

const ADD_PROPOSAL = 'ADD_PROPOSAL';
const ADD_PROPOSAL_ERROR = 'ADD_PROPOSAL_ERROR';

function fetchingProposals () {
    return {
        type: FETCHING_PROPOSALS,
    };
}

function fetchingProposalsError (error) {
    console.warn(error);
    return {
        type: FETCHING_PROPOSALS_ERROR,
        error: 'error fething proposals',
    };
}

function fetchingProposalsSuccess (proposals) {
    return {
        type: FETCHING_PROPOSALS_SUCCESS,
        proposals,
    };
}

function addProposal (proposal) {
    return {
        type: ADD_PROPOSAL,
        proposal,
    };
}

function addProposalError (error) {
    console.warn(error);
    return {
        type: ADD_PROPOSAL_ERROR,
        error: 'error adding proposal',
    };
}

export function handleFetchingProposals () {
    return function (dispatch, getState) {
        if (getState().proposals.get('isFetching')) {
            return;
        }

        if (!isModuleStale(getState().proposals.get('lastUpdated'))) {
            return;
        }

        dispatch(fetchingProposals());
        fetchProposals()
            .then((proposals) => dispatch(fetchingProposalsSuccess(proposals)))
            .catch((error) => dispatch(fetchingProposalsError(error)));
    };
}

export function handleAddProposal (proposal) {
    return function (dispatch) {
        saveProposal(proposal)
            .then((proposalWithId) => dispatch(addProposal(proposalWithId)))
            .catch((error) => dispatch(addProposalError(error)));
    };
}

const initialState = fromJS({
    isFetching: false,
    lastUpdated: 0,
    error: '',
});

export default function proposals (state = initialState, action) {
    switch (action.type) {
    case FETCHING_PROPOSALS:
        return state.set('isFetching', true);
    case ADD_PROPOSAL_ERROR:
    case FETCHING_PROPOSALS_ERROR:
        return state.merge({
            isFetching: false,
            error: action.error,
        });
    case FETCHING_PROPOSALS_SUCCESS:
        return state.merge({
            isFetching: false,
            error: '',
            lastUpdated: Date.now(),
            ...action.proposals,
        });
    default:
        return state;
    }
}
