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

function fetchingUserProposalsSuccess (userProposals) {
    return {
        type: FETCHING_USER_PROPOSALS_SUCCESS,
        userProposals,
    };
}

export function handleFetchingUserProposals (uid) {
    return function (dispatch, getState) {
        if (getState().userProposals.get('isFetching')) {
            return;
        }

        if (!isModuleStale(getState().userProposals.get('lastUpdated'))) {
            return;
        }

        dispatch(fetchingUserProposals());
        fetchUserProposals(uid)
            .then((userProposals) => {
                console.log(userProposals);
                dispatch(fetchingUserProposalsSuccess(userProposals));
            })
            .catch((error) => {
                dispatch(fetchingUserProposalsError(error));
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
    lastUpdated: 0,
    domain: {
        start: 0,
        end: 1,
    },
    proposals: {},
    votes: {},
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
            error: '',
            lastUpdated: Date.now(),
            ...action.userProposals,
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
