import {fromJS} from 'immutable';
import {isModuleStale} from 'helpers/utils';
import {fetchUserProposals} from 'helpers/api';
const FETCHING_USER_PROPOSALS = 'FETCHING_USER_PROPOSALS';
const FETCHING_USER_PROPOSALS_ERROR = 'FETCHING_USER_PROPOSALS_ERROR';
const FETCHING_USER_PROPOSALS_SUCCESS = 'FETCHING_USER_PROPOSALS_SUCCESS';

const SET_DOMAIN = 'SET_DOMAIN';
const ADD_USER_PROPOSAL = 'ADD_USER_PROPOSAL';

function fetchingUserProposals () {
    return {
        type: FETCHING_USER_PROPOSALS,
    };
}

function fetchingUserProposalsError (error) {
    console.error(error);
    return {
        type: FETCHING_USER_PROPOSALS_ERROR,
        error: 'error fetching user proposals',
    };
}

function fetchingUserProposalsSuccess (proposalIds) {
    return {
        type: FETCHING_USER_PROPOSALS_SUCCESS,
        proposalIds,
    };
}

export function handleFetchingUserProposals (uid) {
    return function (dispatch, getState) {
        if (getState().userProposals.get('isFetching')) {
            return Promise.resolve(null);
        }

        if (!isModuleStale(getState().userProposals.get('lastUpdated'), 10)) {
            return Promise.resolve(getState.userProposals.get('proposals'));
        }

        dispatch(fetchingUserProposals());
        fetchUserProposals(uid)
            .then((proposalIds) => {
                dispatch(fetchingUserProposalsSuccess(proposalIds));
                return Promise.resolve(proposalIds);
            })
            .catch((error) => {
                dispatch(fetchingUserProposalsError(error));
                return Promise.resolve(null);
            });
    };
}

export function setDomain (domain) {
    return {
        type: SET_DOMAIN,
        domain,
    };
}

export function addUserProposal (proposalId) {
    return {
        type: ADD_USER_PROPOSAL,
        proposalId,
    };
}

const initialState = fromJS({
    isFetching: false,
    error: '',
    domain: {start: 0.0, end: 1.0},
    proposals: [],
});

export default function userProposals (state = initialState, action) {
    switch (action.type) {
    case FETCHING_USER_PROPOSALS:
        return state.set('isFetching', true);
    case FETCHING_USER_PROPOSALS_ERROR:
        return state.merge({
            error: action.error,
            isFetching: false,
        });
    case FETCHING_USER_PROPOSALS_SUCCESS:
        return state.merge({
            isFetching: false,
            proposals: action.proposalIds,
        });
    case SET_DOMAIN:
        console.log(action.domain);
        return state.set('domain', fromJS(action.domain));
    case ADD_USER_PROPOSAL:
        return state.update('proposals', (ary) => ary.push(action.proposalId));
    default :
        return state;
    }
}
