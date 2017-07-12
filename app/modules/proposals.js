import { fromJS } from 'immutable';
import { saveProposal, fetchProposals, modifyBikecoin } from 'helpers/api';
// import {ADD_USER_VOTE, REMOVE_USER_VOTE} from 'modules/userVotes';
import { isModuleStale } from 'helpers/utils';

const FETCHING_PROPOSALS = 'FETCHING_PROPOSALS';
const FETCHING_PROPOSALS_ERROR = 'FETCHING_PROPOSALS_ERROR';
const FETCHING_PROPOSALS_SUCCESS = 'FETCHING_PROPOSALS_SUCCESS';

export const ADD_PROPOSAL = 'ADD_PROPOSAL';
export const ADD_PROPOSAL_ERROR = 'ADD_PROPOSAL_ERROR';

export const BIKECOIN_TRANSACTION = 'BIKECOIN_TRANSACTION';
export const BIKECOIN_TRANSACTION_ERROR = 'BIKECOIN_TRANSACTION_ERROR';

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

function bikecoinTransaction (uid, roadId, proposalId, value) {
    return {
        type: BIKECOIN_TRANSACTION,
        uid,
        roadId,
        proposalId,
        value, //deltaValue
    };
}

function bikecoinTransactionError (error) {
    console.warn(error);
    return {
        type: BIKECOIN_TRANSACTION_ERROR,
        error: 'error changing bikecoin',
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

export function handleBikecoinTransaction (uid, proposalId, value) {
    return function (dispatch, getState) {
        // the following changes the db side all at once
        modifyBikecoin(uid, proposalId, value)
            .then(({deltaCoins, roadId}) => dispatch(bikecoinTransaction(uid, roadId, proposalId, deltaCoins)))
            .catch((error) => dispatch(bikecoinTransactionError(error)));
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
    case BIKECOIN_TRANSACTION_ERROR:
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
    case ADD_PROPOSAL:
        return state.merge({
            [action.proposal.proposalId]: action.proposal,
        });
    case BIKECOIN_TRANSACTION:
        return state.updateIn([action.proposalId, 'currentUnits'], (curr) => curr + action.value);
    default:
        return state;
    }
}
