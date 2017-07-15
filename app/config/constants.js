// @flow
import firebase from 'firebase';
import { fromJS } from 'immutable';

//
// THRESHOLDS
//

export const threshold: number = 0.85;
export const thresholdLength: number = 500; // ms
export const doubleDingDuration: number = 1500; // ms
export const maxCommuteLife: number = 20000; // ms
export const updateCycleDuration: number = 5000; // ms
export const renderTimeConstrain: number = 10000; // ms
export const recordDuration: number = 5000; // ms
export const waitDuration: number = 3000; // ms
export const dingDetectionGap: number = 120;
export const updateDuration: number = 1 * 60 * 1000; // 1min

export const bufferAveraging: number = 2;

// the range of frequency in consideration
export const minFreq: number = 1950;
export const maxFreq: number = 4050;
export const fftSize: number = 1024;

//
// GENERAL
//

export const isProduction: boolean = process.env.NODE_ENV === 'production';
export const rootUrl: string = isProduction ? 'https://bikebump.media.mit.edu' : 'http://localhost:8080';
export const imgRoot: string = `${rootUrl}/static/img/`;
export const apiRoot: string = isProduction ? 'https://bikebump.media.mit.edu/api/' : 'http://localhost:8081/api/';

//
// firebase
//

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyAZE26Lxuw35m7ZmYZHYLacfOgw8x9cyng',
    authDomain: 'bikebump-ea3b1.firebaseapp.com',
    databaseURL: 'https://bikebump-ea3b1.firebaseio.com',
    storageBucket: 'bikebump-ea3b1.appspot.com',
    messagingSenderId: '642352920574',
};

firebase.initializeApp(firebaseConfig);

export const ref: firebase.database.Reference = firebase.database().ref();
export const firebaseAuth: firebase.auth.Auth = firebase.auth;
export const firebaseStorage: firebase.storage.Reference = firebase.storage().ref();
export const isRemote: boolean = false;

//
// leaflet
//
const mapboxURL: string = 'https://api.mapbox.com/styles/v1/yasushisakai/';
const mapboxToken: string = 'pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA';
export const darkTile: string = `${mapboxURL}ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`;

export const attribution: string = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe';

//
// MISC
//

export const initialState = fromJS({
    isFetching: false,
    error: '',
    lastUpdated: 0,
});

export const yellow = '#f8e71c';
export const red = '#d0021b';
export const orange = '#f5a623';
export const blue = '#4a90e2';
export const green = '#7ed321';
export const black = '#252525';
export const white = '#f0f0f0';

//
// AudioContext
//

export const AudioContext = window.AudioContext || window.webkitAudioContext;

