import { fromJS } from 'immutable';
import { isModuleStale } from 'helpers/utils';
import { getRankings } from 'helpers/api';

const FETCHING_RANKING = 'FETCHING_RANKING';
const FETCHING_RANKING_ERROR = 'FETCHING_RANKING_ERROR';
const FETCHING_RANKING_SUCCESS = 'FETCHING_RANKING_SUCCESS';
const REMOVE_FETCHING_RANKING = 'REMOVE_FETCHING_RANKING';

function fetchingRanking () {
    return {
        type: FETCHING_RANKING,
    };
}

function fetchingRankingError (error) {
    console.error(error);
    return {
        type: FETCHING_RANKING_ERROR,
        error: 'error fetching ranking',
    };
}

function fetchingRankingSuccess (rankings) {
    return {
        type: FETCHING_RANKING_SUCCESS,
        rankings,
    };
}

function removeFetchingRanking () {
    return {
        type: REMOVE_FETCHING_RANKING,
    };
}

export function handleFetchingRankings (uid) {
    return function (dispatch, getState) {
        if (getState().rankings.get('isFetching')) {
            return;
        }

        dispatch(fetchingRanking());
        if (!isModuleStale(getState().rankings.get('lastUpdated'))) {
            dispatch(removeFetchingRanking());
            return;
        }

        getRankings(uid)
            .then((rankings) => dispatch(fetchingRankingSuccess(rankings)))
            .catch((error) => dispatch(fetchingRankingError(error)));
    };
}

const initialState = fromJS(
    {
        isFetching: false,
        lastUpdated: 0,
        error: '',
        dingRanking: 0,
        proposalRanking: 0,
        responseRanking: 0,
    }
);

export default function rankings (state = initialState, action) {
    switch (action.type) {
    case FETCHING_RANKING:
        return state.set('isFetching', true);
    case FETCHING_RANKING_ERROR:
        return state.merge({
            isFetching: false,
            error: action.error,
        });
    case FETCHING_RANKING_SUCCESS: {
        const {dingRanking, proposalRanking, responseRanking} = action.rankings;
        return state.merge({
            isFetching: false,
            error: '',
            dingRanking,
            proposalRanking,
            responseRanking,
        });
    }
    case REMOVE_FETCHING_RANKING:
        return state.set('isFetching', false);
    default :
        return state;
    }
}
