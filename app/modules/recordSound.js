import {fromJS} from 'immutable';

const SET_RECORD_FALSE = 'SET_RECORD_FALSE';
const SET_RECORD_TRUE = 'SET_RECORD_TRUE';

function setRecordFalse () {
    return {
        type: SET_RECORD_FALSE,
    };
}

function setRecordTrue () {
    return {
        type: SET_RECORD_TRUE,
        lastStart: Date.now(),
    };
}

export function setRecording (flag) {
    return function (dispatch, getState) {
        if (flag) {
            return dispatch(setRecordTrue());
        } else {
            return dispatch(setRecordFalse());
        }
    };
}

export function toggleRecord () {
    return function (dispatch, getState) {
        if (getState().recordSound.get('isRecording')) {
            return dispatch(setRecordFalse());
        } else {
            return dispatch(setRecordTrue());
        }
    };
}

const initialState = fromJS({
    isRecording: false,
    lastStart: Date.now(),
});

export default function recordSound (state = initialState, action) {
    switch (action.type) {
    case SET_RECORD_FALSE:
        return state.set('isRecording', false);
    case SET_RECORD_TRUE:
        return state.set('isRecording', true);
    default :
        return state;
    }
}
