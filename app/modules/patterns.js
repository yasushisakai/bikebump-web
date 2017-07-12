import { fromJS } from 'immutable';
import { fetchPatterns, savePattern } from 'helpers/api';
import { isModuleStale } from 'helpers/utils';

const FETCHING_PATTERNS = 'FETCHING_PATTERNS';
const FETCHING_PATTERNS_ERROR = 'FETCHING_PATTERNS_ERROR';
const FETCHING_PATTERNS_SUCCESS = 'FETCHING_PATTERNS_SUCCESS';
const REMOVE_FETCHING_PATTERNS = 'REMOVE_FETCHING_PATTERNS';

const initialState = fromJS({
    isFetching: false,
    error: '',
    lastUpdated: 0,
});

function fetchingPatterns () {
    return {
        type: FETCHING_PATTERNS,
    };
}
function fetchingPatternsError (error) {
    console.warn(error);
    return {
        type: FETCHING_PATTERNS_ERROR,
        error: 'error fetching patterns',
    };
}

function removeFetchingPatterns () {
    return {
        type: REMOVE_FETCHING_PATTERNS,
    };
}

function fetchingPatternsSuccess (patterns) {
    return {
        type: FETCHING_PATTERNS_SUCCESS,
        patterns,
    };
}

export function handleFetchingPatterns () {
    return function (dispatch, getState) {
        if (getState().patterns.get('isFetching')) {
            return;
        }

        dispatch(fetchingPatterns());

        if (!isModuleStale(getState().patterns.get('lastUpdated'))) {
            dispatch(removeFetchingPatterns());
            return;
        }

        return fetchPatterns()
            .then((patterns) => dispatch(fetchingPatternsSuccess(patterns)))
            .catch((error) => dispatch(fetchingPatternsError(error)));
    };
}

export default function patterns (state = initialState, action) {
    switch (action.type) {
    case FETCHING_PATTERNS:
        return state.set('isFetching', true);
    case FETCHING_PATTERNS_ERROR:
        return state.merge({
            isFetching: false,
            error: action.error,
        });
    case FETCHING_PATTERNS_SUCCESS:
        return state.merge({
            isFetching: false,
            error: '',
            lastUpdated: Date.now(),
        }).merge(action.patterns);
    case REMOVE_FETCHING_PATTERNS:
        return state.set('isFetching', false);
    default:
        return state;
    }
}
