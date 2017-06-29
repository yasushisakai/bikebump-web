import { fromJS } from 'immutable';
import { fetchGeoLocation, refreshCommute, formatWavFileName, distFromLatLng } from 'helpers/utils';
import { createCommute, appendBreadcrumb, createUserDing, deleteCommute } from 'helpers/api';
import { storeBlob } from 'helpers/storage';
import { addUserDing, userDingStatus } from 'modules/userDings';
import { doubleDingDuration, threshold, thresholdLength } from 'config/constants';

const STOP_RECORDING = 'STOP_RECORDING';
const START_RECORDING = 'START_RECORDING';
const RECORD_ERROR = 'RECORD_ERROR';

const WAIT_DETECTION = 'WAIT_DETECTION';
const LEAVE_DETECTION = 'LEAVE_DETECTION';
const RETURN_DETECTION = 'RETURN_DETECTION';

const ADD_PENDING = 'ADD_PENDING_DING';
const REMOVE_PENDING = 'REMOVE_PENDING';

const INSIDE_DING = 'INSIDE_DING';
const OUTSIDE_DING = 'OUTSIDE_DING';

const UPLOADING_CLIP = 'UPLOADING_CLIP';
const UPLOADING_CLIP_ERROR = 'UPLOADING_CLIP_ERROR';
const UPLOADING_CLIP_SUCCESS = 'UPLOADING_CLIP_SUCCESS';

const FETCHING_LATLNG = 'FETCHING_LATLNG';
const FETCHING_LATLNG_ERROR = 'FETCHING_LATLNG_ERROR';
const FETCHING_LATLNG_SUCCESS = 'FETCHING_LATLNG_SUCCESS';

const detectionStatus = {
  INITIAL: 0,
  WAITING: 1,
  LEAVING: 2,
};

/*
const dingType = {
  NOT_DING: 0,
  SINGLE_DING: 1,
  DOUBLE_DING: 2,
}
*/

function stopRecording () {
  return {
    type: STOP_RECORDING,
  };
}

function startRecording (commuteId) {
  return {
    type: START_RECORDING,
    commuteId,
  };
}

function waitDetection () {
  return {
    type: WAIT_DETECTION,
  };
}

export function handleDetection (slopes) {
  return function (dispatch, getState) {
    const status = getState().record.get('detectionStatus');
    if (slopes[0] > threshold && slopes[1] > threshold) {
      if (status === detectionStatus.INITIAL) {
        dispatch(waitDetection());
      } else if (status === detectionStatus.WAITING) {
        if (Date.now() - getState().record.get('lastTimeOverThreshold') > thresholdLength) {
          // detection!
          console.log('DING');
          dispatch(leaveDetection());
          return true;
        } else {
          // waiting...
          return false;
        }
      } else { // status === detectionStatus.LEAVING
        return false;
      }
    } else {
      if (status !== detectionStatus.INITIAL) {
        console.log(Date.now() - getState().record.get('lastDetection'));
        dispatch(returnDetection());
      }
      return false;
    }
  };
}

function leaveDetection () {
  return {
    type: LEAVE_DETECTION,
  };
}

function returnDetection () {
  return {
    type: RETURN_DETECTION,
  };
}

function addPending (lat, lng, timestamp) {
  return {
    type: ADD_PENDING,
    lat,
    lng,
    timestamp,
  };
}

function removePending () {
  return {
    type: REMOVE_PENDING,
  };
}

/*
export function handleReleasePending (timestamp) { 
  return function (dispatch, getState) {
    if(!getState().record.get('isPending')) {

    }
  }
}

*/

export function uploadingClip () {
  return {
    type: UPLOADING_CLIP,
  };
}

export function uploadingClipError (error) {
  console.warn(error);
  return {
    error: 'error uploading clip',
    type: UPLOADING_CLIP_ERROR,
  };
}

export function uploadingClipSuccess () {
  return {
    type: UPLOADING_CLIP_SUCCESS,
  };
}

export function handleUpload (recorder, location, timestamp) {
  return function (dispatch, getState) {
    if (getState().record.get('isUploading')) return;

    dispatch(uploadingClip());
    recorder.exportWAV((blob) => {
      const filename = formatWavFileName(timestamp, location);
      console.log(filename);
      storeBlob(filename, blob)
        .then(() => dispatch(uploadingClipSuccess()));
    });
  };
}

export function handleRecordInitiation (uid) {
  return function (dispatch, getState) {
    return createCommute(uid)
      .then((commuteId) => dispatch(startRecording(commuteId)));
  };
}
export function toggleRecording () {
  return function (dispatch, getState) {
    if (
      getState().record.get('isRecording') === true ||
        getState().users.get('isAuthed') === false
    ) {
      dispatch(stopRecording());
      return Promise.resolve({isRecording: false});
    } else {
      const authedId = getState().users.get('authedId');
      return dispatch(handleRecordInitiation(authedId))
        .then((action) => Promise.resolve({isRecording: true, commuteId: action.commuteId}));
    }
  };
}

function fetchingLatLng () {
  return {
    type: FETCHING_LATLNG,
  };
}

function fetchingLatLngError (error) {
  console.warn(error);
  return {
    type: FETCHING_LATLNG_ERROR,
    error: 'error fetching latlng',
  };
}

function fetchingLatLngSuccess (location, timestamp = Date.now()) {
  return {
    type: FETCHING_LATLNG_SUCCESS,
    location,
    timestamp,
  };
}

function insideDing (dingId) {
  return {
    type: INSIDE_DING,
    dingId,
  };
}

function outsideDing () {
  return {
    type: OUTSIDE_DING,
  };
}

export function handleFetchLatLng (commuteId) {
  return function (dispatch, getState) {
    if (!getState().record.get('isRecording')) {
      return Promise.resolve(null);
    }

    const commuteId = getState().record.get('currentCommuteId');

    dispatch(fetchingLatLng());
    return fetchGeoLocation()
      .then((coordinates) => dispatch(fetchingLatLngSuccess(coordinates)))
      .then(({location, timestamp}) => {
        // detects whether its inside a existing geo fence
        let isInside = false;
        let whichDing = '';

        // run through the dings to see which dings are we including
        // rule: each fetch should only add one passed by ding
        getState().dingFeed.get('dingIds').toJS().map(dingId => {
          const ding = getState().dings.get(dingId);
          const distance = distFromLatLng(ding.get('coordinates').toJS(), location);

          if (distance < ding.get('radius')) {
            // append as passed by to userDings (+server)
            isInside = true;
            whichDing = dingId;
            const uid = getState().users.get('authedId');

            // console.log(getState().userDings.getIn([uid, dingId]).toJS())

            const currentStats = getState().userDings.getIn([uid, dingId, 'status']);

            // console.log(currentStats)

            if (
              currentStats !== userDingStatus.DINGED &&
              currentStats !== userDingStatus.PASSEDBY
            ) {
              // add this ding as my user ding
              createUserDing(uid, dingId, userDingStatus.PASSEDBY, commuteId, timestamp)
                .then(dispatch(addUserDing(uid, dingId, userDingStatus.PASSEDBY, commuteId, timestamp)));
            }
          }
        });

        // mutate state according to
        if (isInside) {
          if (
            !getState().record.get('isInside') || // we weren't inside and,
            getState().record.get('whichDing') !== whichDing // or were inside of a different ding
          ) { dispatch(insideDing(whichDing)); }
        } else {
          if (getState().record.get('isInside')) dispatch(outsideDing());
        }
        return {location, timestamp};
      })
      .then(({location, timestamp}) => {
        if (refreshCommute(timestamp)) {
          // if the commutee is too old reinitiate it
          if (getState().record.get('breadcrumbNum') < 2) {
            deleteCommute(commuteId);
          }

          dispatch(stopRecording());
          // handleRecordInitiation()
        } else {
          // else, the commute is still alive = append
          appendBreadcrumb(commuteId, location, timestamp);
        }
      })
      .catch((error) => dispatch(fetchingLatLngError(error)));
  };
}

const initialState = fromJS({
  isFetchingLatLng: false,
  isRecording: false,
  detectionStatus: detectionStatus.INITIAL,
  isCapturing: false,
  isUploading: false,
  isInside: false,
  whichDing: '',
  currentCommuteId: '',
  latestLocation: {
    lat: 0,
    lng: 0,
  },
  latestFetchAttempt: 0,
  lastTimeOverThreshold: 0,
  lastDetection: 0,
  latestFetch: 0,
  error: '',
  isPending: false,
  pending: {
    dingId: '',
    timestamp: 0,
  },
});

export default function record (state = initialState, action) {
  switch (action.type) {
    case STOP_RECORDING:
      return state.merge({
        isRecording: false,
        currentCommuteId: '',
      });
    case START_RECORDING:
      return state.merge({
        isRecording: true,
        currentCommuteId: action.commuteId,
      });
    case WAIT_DETECTION:
      return state.merge({
        detectionStatus: detectionStatus.WAITING,
        lastTimeOverThreshold: Date.now(),
      });
    case LEAVE_DETECTION:
      return state.merge({
        detectionStatus: detectionStatus.LEAVING,
        lastTimeOverThreshold: Date.now(),
        lastDetection: Date.now(),
      });
    case RETURN_DETECTION:
      return state.merge({
        detectionStatus: detectionStatus.INITIAL,
        lastTimeOverThreshold: Date.now(),
      });
    case ADD_PENDING:
      return state.merge({
        isPending: true,
        pending: {
          dingId: action.dingId,
          timestamp: action.timestamp,
        },
      });
    case REMOVE_PENDING:
      return state.merge({
        isPending: false,
        pending: {
          dingId: '',
          timestamp: 0,
        },
      });
    case UPLOADING_CLIP:
      return state.set('isUploading', true);
    case UPLOADING_CLIP_SUCCESS:
      return state.set('isUploading', false);
    case FETCHING_LATLNG:
      return state.merge({
        isFetchingLatLng: true,
        latestFetchAttempt: Date.now(),
      });
    case INSIDE_DING:
      return state.set('isInside', true).set('whichDing', action.dingId);
    case OUTSIDE_DING:
      return state.set('isInside', false).set('whichDing', '');
    case UPLOADING_CLIP_ERROR:
    case RECORD_ERROR:
    case FETCHING_LATLNG_ERROR:
      return state.merge({
        isRecording: false,
        isFetchingLatLng: false,
        error: action.error,
      });
    case FETCHING_LATLNG_SUCCESS:
      return state.merge({
        isFetchingLatLng: false,
        latestFetch: action.timestamp,
        latestLocation: action.location,
      });
    default:
      return state;
  }
}
