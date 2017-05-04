import { fromJS } from 'immutable'
import { fetchPatterns, fetchPattern, savePattern } from 'helpers/api'
import { checkLastUpdate } from 'helpers/utils'

const FETCHING_PATTERNS = 'FETCHING_PATTERNS'
const FETCHING_PATTERNS_ERROR = 'FETCHING_PATTERNS_ERROR'
const FETCHING_PATTERNS_SUCCESS = 'FETCHING_PATTERNS_SUCCESS'

const ADD_PATTERN = 'ADD_PATTERN'
const ADD_PATTERN_ERROR = 'ADD_PATTERN_ERROR'

const initialState = fromJS({
  isFetching: true,
  error: '',
  lastUpdated: 0,
})

function fetchingPatterns () {
  return {
    type: FETCHING_PATTERNS,
  }
}
function fetchingPatternsError (error) {
  console.warn(error)
  return {
    type: FETCHING_PATTERNS_ERROR,
    error: 'error fetching patterns',
  }
}

function addPatternError (error) {
  console.warn(error)
  return {
    type: ADD_PATTERN_ERROR,
    error: 'error adding pattern',
  }
}

function fetchingPatternsSuccess (patterns) {
  return {
    type: FETCHING_PATTERNS_SUCCESS,
    patterns,
  }
}

function addPattern (pattern) {
  return {
    type: ADD_PATTERN,
    pattern,
  }
}

export function handleFetchingPatterns () {
  return function (dispatch, getState) {
    if (!checkLastUpdate(getState().patterns.get('lastUpdated'), 10)) {
      const justPatterns = getState().patterns.keySeq().toArray()
        .filter(key => (key !== 'isFetching' && key !== 'error' && key !== 'lastUpdated'))
        .map(key => getState().patterns.get(key))
      return Promise.resolve(justPatterns)
    }
    dispatch(fetchingPatterns())
    return fetchPatterns()
      .then((patterns) => dispatch(fetchingPatternsSuccess(patterns)))
      .catch((error) => dispatch(fetchingPatternsError(error)))
  }
}

export function handleAddPattern (pattern) {
  return function (dispatch) {
    dispatch(fetchingPatterns)
    savePattern(pattern)
      .then((patternWithId) => dispatch(addPattern(patternWithId)))
      .catch((error) => dispatch(addPatternError(error)))
  }
}

export default function patterns (state = initialState, action) {
  switch (action.type) {
    case FETCHING_PATTERNS:
      return state.set('inFetching', true)
    case ADD_PATTERN_ERROR:
    case FETCHING_PATTERNS_ERROR:
      return state.merge({
        isFetching: false,
        error: action.error,
      })
    case FETCHING_PATTERNS_SUCCESS:
      return state.merge({
        isFetching: false,
        lastUpdated: Date.now(),
      }).merge(action.patterns)
    case ADD_PATTERN:
      return state.set(action.pattern.patternId, action.pattern)
    default:
      return state
  }
}
