import {fromJS, List} from 'immutable';
import {isModuleStale} from 'helpers/utils';
import { fetchUserProposals } from 'helpers/api';
const FETCHING_USER_PROPOSALS = 'FETCHING_USER_PROPOSALS';
const FETCHING_USER_PROPOSALS_ERROR = 'FETCHING_USER_PROPOSALS_ERROR';
const FETCHING_USER_PROPOSALS_SUCCESS = 'FETCHING_USER_PROPOSALS_SUCCESS';

const SET_DOMAIN = 'SET_DOMAIN';
const SET_PATTERN_ID = 'SET_PATTERN_ID';
const SET_SLIDER_DISABLED = 'SET_SLIDER_DISABLED';
const SET_SUBMIT_DISABLED = 'SET_SUBMIT_DISABLED';
const SET_REQUIRED_POINTS = 'SET_REQUIRED_POINTS';

import {
    ADD_PROPOSAL,
    ADD_PROPOSAL_ERROR,
    BIKECOIN_TRANSACTION,
    BIKECOIN_TRANSACTION_ERROR
} from 'modules/proposals';

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
            .then((rawUserProposals) => {
                let userProposals = {};
                //console.log(rawUserProposals[`${uid}`]);
                if (rawUserProposals) {
                    let tempConversion = {};
                    Object.keys(rawUserProposals.proposals).map((roadId) => {
                        tempConversion[roadId] = Object.keys(rawUserProposals.proposals[roadId]);
                    });
                    userProposals = {...rawUserProposals, proposals: tempConversion};
                } else {
                    userProposals = {proposals: {}};
                }
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

export function setPatternId (patternId) {
    return {
        type: SET_PATTERN_ID,
        id: patternId,
    };
}

export function setSliderDisabled (flag) {
    return {
        type: SET_SLIDER_DISABLED,
        flag,
    };
}

export function setSubmitDisabled (flag) {
    return {
        type: SET_SUBMIT_DISABLED,
        flag,
    };
}

export function setRequiredPoints (points) {
    return {
        type: SET_REQUIRED_POINTS,
        points,
    };
}

function singleUserProposal (state = fromJS({}), action) {
    switch (action.type) {
    case ADD_PROPOSAL:
        return state.set(action.proposal.proposalId, 0);
    default:
        return state;
    }
}

const initialState = fromJS({
    isFetching: false,
    error: '',
    lastUpdated: 0,
    units: 100,
    proposals: {},
    votes: {},
    create: {
        domain: {
            start: 0,
            end: 1,
        },
        patternId: '',
        sliderDisabled: true,
        submitDisabled: true,
        requiredPoints: 0,
    },
});

export default function userProposals (state = initialState, action) {
    switch (action.type) {
    case FETCHING_USER_PROPOSALS:
        return state.set('isFetching', true);
    case ADD_PROPOSAL_ERROR:
    case BIKECOIN_TRANSACTION_ERROR:
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
        return state.setIn(['create', 'domain'], fromJS(action.domain));
    case SET_PATTERN_ID:
        return state.setIn(['create', 'patternId'], action.id);
    case SET_SLIDER_DISABLED:
        return state.setIn(['create', 'sliderDisabled'], action.flag);
    case SET_SUBMIT_DISABLED:
        return state.setIn(['create', 'submitDisabled'], action.flag);
    case SET_REQUIRED_POINTS:
        return state.setIn(['create', 'requiredPoints'], action.points);
    case ADD_PROPOSAL:
        return state.set('proposals', singleUserProposal(state.get('proposals'), action));
    case BIKECOIN_TRANSACTION:
        return state.updateIn(['votes', action.proposalId], curr => curr + action.value).update('units', curr => curr - action.value);
    default :
        return state;
    }
}
