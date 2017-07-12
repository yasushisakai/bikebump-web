import { fromJS } from 'immutable';
import { isModuleStale } from 'helpers/utils';
import { fetchRoadProposals } from 'helpers/api';

const FETCHING_ROAD_PROPOSAL = 'FETCHING_ROAD_PROPOSAL';
const FETCHING_ROAD_PROPOSAL_ERROR = 'FETCHING_ROAD_PROPOSAL_ERROR';
const FETCHING_ROAD_PROPOSAL_SUCCESS = 'FETCHING_ROAD_PROPOSAL_SUCCESS';
import { ADD_PROPOSAL, ADD_PROPOSAL_ERROR, BIKECOIN_TRANSACTION, BIKECOIN_TRANSACTION_ERROR } from 'modules/proposals';

function fetchingRoadProposals () {
    return {
        type: FETCHING_ROAD_PROPOSAL,
    };
}

function fetchingRoadProposalsError (error) {
    console.error(error);
    return {
        type: FETCHING_ROAD_PROPOSAL_ERROR,
        error: 'error fetching road proposal',
    };
}

function fetchingRoadProposalsSuccess (roadProposals) {
    return {
        type: FETCHING_ROAD_PROPOSAL_SUCCESS,
        roadProposals,
    };
}

export function handleFetchingRoadProposals () {
    return function (dispatch, getState) {
        if (getState().roadProposals.get('isFetching')) {
            return;
        }

        if (!isModuleStale(getState().roadProposals.get('lastUpdated'))) {
            // dispatch(removeFetchingRoadProposals());
            return;
        }

        dispatch(fetchingRoadProposals());
        return fetchRoadProposals()
            .then((roadProposals) => dispatch(fetchingRoadProposalsSuccess(roadProposals)))
            .catch((error) => dispatch(fetchingRoadProposalsError(error)));
    };
}

const initialState = fromJS(
    {
        isFetching: false,
        error: '',
        lastUpdated: 0,
    }
);

export default function roadProposal (state = initialState, action) {
    switch (action.type) {
    case FETCHING_ROAD_PROPOSAL:
        return state.set('isFetching', true);
    case ADD_PROPOSAL_ERROR:
    case FETCHING_ROAD_PROPOSAL_ERROR:
    case BIKECOIN_TRANSACTION_ERROR:
        return state.merge({
            error: action.error,
            isFetching: false,
        });
    case FETCHING_ROAD_PROPOSAL_SUCCESS:
        return state.merge({
            error: '',
            isFetching: false,
            ...action.roadProposals,
            lastUpdated: Date.now(),
        });
    case ADD_PROPOSAL:
        return state.setIn([action.proposal.roadId, action.proposal.proposalId], 0);
    case BIKECOIN_TRANSACTION:
        return state.updateIn([action.roadId, action.proposalId], (value) => value + action.value);
    default :
        return state;
    }
}
