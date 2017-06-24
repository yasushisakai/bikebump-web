// @flow
import firebase from 'firebase';
import { Map } from 'immutable';
//
// THRESHOLDS
//

export const threshold: number = 5;
export const thresholdLength: number = 300; // ms
export const doubleDingDuration: number = 1500; // ms
export const maxCommuteLife: number = 20000; // ms
export const updateCycleDuration: number = 5000; // ms
export const renderTimeConstrain: number = 10000; // ms
export const recordDuration: number = 5000; // ms
export const waitDuration: number = 3000; // ms
export const dingDetectionGap: number = 120;
export const updateDuration: number = 1 * 60 * 1000; // 1min

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
export const tileURL: string = `${mapboxURL}ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`;
export const tinyTileURL: string = `${mapboxURL}cizesntvz00c52sqirwrxlivb/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`;
export const lightURL: string = `${mapboxURL}cj14tdytp000s2ro72nd7nipf/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`;

export const attribution: string = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe';
export const tinyAttribution: string = '&copy; Mapbox &copy; OpenStreetMap';

//
// MISC
//

export const initialState = new Map({
  isFetching: false,
  error: '',
  lastUpdated: 0,
});

