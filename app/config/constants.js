import firebase from 'firebase'
import { Map } from 'immutable' 

export const minimalLatLngRefresh = 5000 // ms
export const maxCommuteLife = 20000 // ms 
export const updateCycleDuration = 7000 //ms
export const renderTimeConstrain = 10000 //ms
export const recordDuration = 5000 //ms
export const waitDuration = 3000 //ms
export const dingDetectionGap = 120
export const updateDuration = 5 * 60 * 1000 // 5min 

export const initialState = new Map({
  isFetching: true,
  error: '',
})


//
// GENERAL
//

export const isProduction = process.env.NODE_ENV == 'production'
export const rootUrl = isProduction ? 'https://bikebump.media.mit.edu' : 'http://localhost:8080'
export const imgRoot = `${rootUrl}/static/img/`
export const apiRoot = isProduction ? 'https://bikebump.media.mit.edu/api/' : 'http://localhost:8081/api/'

//
// firebase
//

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAZE26Lxuw35m7ZmYZHYLacfOgw8x9cyng",
  authDomain: "bikebump-ea3b1.firebaseapp.com",
  databaseURL: "https://bikebump-ea3b1.firebaseio.com",
  storageBucket: "bikebump-ea3b1.appspot.com",
  messagingSenderId: "642352920574"
};

firebase.initializeApp(firebaseConfig);

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
export const firebaseStorage = firebase.storage().ref()
export const isRemote = false


//
// leaflet
//
export const tileURL = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA'

export const attribution = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe'