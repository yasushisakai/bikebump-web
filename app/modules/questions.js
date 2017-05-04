import { initialState } from 'config/constants'
import { isModuleStale } from 'helpers/utils'
import { fetchAll, saveQuestion, fetchQuestion } from 'helpers/api'

const FETCHING_QUESTIONS = 'FETCHING_QUESTIONS'
const FETCHING_SINGLE_QUESTION = 'FETCHING_SINGLE_QUESTION'
const FETCHING_QUESTIONS_ERROR = 'FETCHING_QUESTIONS_ERROR'
const FETCHING_QUESTIONS_SUCCESS = 'FETCHING_QUESTIONS_SUCCESS'
const FETCHING_SINGLE_QUESTION_SUCCESS = 'FETCHING_SINGLE_QUESTION_SUCCESS'

const ADD_QUESTION = 'ADD_QUESTION'
const ADD_QUESTION_ERROR = 'ADD_QUESTION_ERROR'

function fetchingQuestions () {
  return {
    type: FETCHING_QUESTIONS,
  }
}

function fetchingSingleQuestion () {
  return {
    type: FETCHING_SINGLE_QUESTION,
  }
}

function fetchingQuestionsError (error) {
  console.warn(error)
  return {
    type: FETCHING_QUESTIONS_ERROR,
    error: 'error fetching questions',
  }
}

function fetchingQuestionsSuccess (questions) {
  return {
    type: FETCHING_QUESTIONS_SUCCESS,
    questions,
  }
}

function fetchingSingleQuestionSuccess (question) {
  return {
    type: FETCHING_SINGLE_QUESTION_SUCCESS,
    question,
  }
}

export function handleFetchingQuestions () {
  return function (dispatch, getState) {
    // if its fetching forget it
    if (getState().questions.get('isFetching')) {
      return Promise.resolve(null)
    }

    // leaving no traces if there its too fresh
    if (!isModuleStale(getState().questions.get('lastUpdated'), 10)) {
      return Promise.resolve(getState().questions)
    }

    dispatch(fetchingQuestions())
    return fetchAll('questions')
      .then((questions) => dispatch(fetchingQuestionsSuccess(questions)))
      .catch((error) => dispatch(fetchingQuestionsError(error)))
  }
}

export function handleFetchingSingleQuestion (questionId) {
  return function (dispatch, getState) {
    if (getState().questions.has(questionId)) {
      return Promise.resolve(getState().questions.get(questionId))
    } else {
      dispatch(fetchingSingleQuestion())
      fetchQuestion(questionId)
        .then(question => dispatch(fetchingSingleQuestionSuccess(question)))
        .catch(error => dispatch(fetchingQuestionsError(error)))
    }
  }
}

function addQuestion (question) {
  return {
    type: ADD_QUESTION,
    question,
  }
}

function addQuestionError (error) {
  console.warn(error)
  return {
    type: ADD_QUESTION_ERROR,
    error: 'error adding Question',
  }
}

export function handleAddQuestion (question) {
  return function (dispatch) {
    saveQuestion(question)
      .then((questionWithId) => dispatch(addQuestion(questionWithId)))
      .catch((error) => dispatch(addQuestionError(error)))
  }
}

export default function questions (state = initialState, action) {
  switch (action.type) {
    case FETCHING_QUESTIONS:
    case FETCHING_SINGLE_QUESTION:
      return state.set('isFetching', true)
    case FETCHING_QUESTIONS_SUCCESS:
      return state.merge({
        isFetching: false,
        error: '',
      }).merge(action.questions)
    case FETCHING_SINGLE_QUESTION_SUCCESS:
      return state.merge({
        isFetching: false,
        error: '',
        [action.question.questionId]: action.question,
      })
    case ADD_QUESTION_ERROR:
    case FETCHING_QUESTIONS_ERROR:
      return state.merge({
        isFetching: false,
        erro: action.error,
      })
    case ADD_QUESTION:
      return state.merge({
        isFetching: false,
        error: '',
        [action.question.questionId]: action.question,
      })
    default:
      return state
  }
}
