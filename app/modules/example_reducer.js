import {fromJS} from 'immutable'

const FETCH_EXAMPLE_CONSTANT = 'EXAMPLE_CONSTANT'
const FETCH_EXAMPLE_CONSTANT_ERROR = 'FETCH_EXAMPLE_CONSTANT_ERROR'
const FETCH_EXAMPLE_CONSTANT_SUCCESS = 'FETCH_EXAMPLE_CONSTANT_SUCCESS'

function fetchExampleConstant() {
  return {
    type: FETCH_EXAMPLE_CONSTANT,
    isFetching: true,
  }
}

function fetchExampleConstant(error) {
  console.warn(error)
  return {
    type: FETCH_EXAMPLE_CONSTANT_ERROR,
    isFetching: false,
    error: 'error fetching example'
  }
}

function fetchExampleConstant() {
  return {
    type: FETCH_EXAMPLE_CONSTANT_SUCCESS,
    isFetching: false,
  }
}

const initialState = fromJS({
  isFetching : false,
  error : ''
})

export default function example(state = initialState,action) {
  switch (action.type) {
   case FETCH_EXAMPLE_CONSTANT :
      return state.merge({
        isFetching:true
      })
  case FETCH_EXAMPLE_CONSTANT_ERROR :
    return state.merge({
      isFetching:false,
      error: action.error
    })
  case FETCH_EXAMPLE_CONSTANT_SUCCESS :
    return state.merge({
      isFetching:false,
    })
  default :
    return state
  }
}