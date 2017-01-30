import firebase from 'firebase'
import { Map } from 'immutable' 

export const minimalLatLngRefresh = 5000 // ms
export const maxCommuteLife = 20000 // ms 
export const updateCycleDuration = 7000 //ms
export const renderTimeConstrain = 10000 //ms

export const initialState = new Map({
  isFetching: true,
  error: '',
})


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
export const isProduction = process.env.NODE_ENV == 'production'
export const isRemote = false
