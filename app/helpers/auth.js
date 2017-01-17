import { ref, firebaseAuth } from 'config/constants'
import firebase from 'firebase'
import axios from 'axios'

const {
  GoogleAuthProvider, 
  GithubAuthProvider, 
  FacebookAuthProvider,
} = firebaseAuth

export const services = {
  google:'google',
  github: 'github',
  facebook: 'facebook',
} 

export function auth (service='google') {
  let provider;
  switch (service){
    case services.google:
      provider = new GoogleAuthProvider
      provider.addScope('email')
      provider.addScope('profile')
      break
    case services.github:
      provider = new GithubAuthProvider
      provider.addScope('user:email')
      break
    case services.facebook:
      provider = new FacebookAuthProvider
      provider.addScope('email')
      break
  }
  return firebase.auth().signInWithPopup(provider)
}

export function getCurrentUser (){
  return firebase.auth().currentUser
}

export function logout (){
  return firebaseAuth().signOut()
}

export function fetchUIdfromEmail (email) {
  // returns null if there is no users assigned
  // returns the uid if there is already one
  const userRef = ref.child('users').orderByChild('email').equalTo(email)
  return userRef.once('value').then((snapshot)=>{
    const uids = snapshot.val() || {}
    return Object.keys(uids)[0] || ''
    })
}

export function checkIfAuthed (store) {
  return store.getState().users.get('isAuthed') === true
}

function saveUser (user) {
  // returns user with new key
  const uid = ref.child('users').push().key
  const updatedUser = {...user,uid,}
  return ref.child(`users/${uid}`).set(updatedUser)
   .then(()=>(updatedUser))
}

export function saveUserDB (user) {
  // check if email is unique
  return fetchUIdfromEmail(user.email)
    .then((uid)=>{
      console.log(uid)
      return uid === '' ? saveUser(user) : {...user,uid}
    })
}

export function checkAccessToken (service,atoken) {
  const accessToken = getAccessToken(service,atoken)
  if( accessToken === null){
    return null
  }
  let requestURL,config={}
  switch (service) {
    case services.google:
      requestURL = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`  
      break
    case services.github:
      requestURL = 'https://api.github.com/user/emails'
       config = {headers:{'Authorization': `token ${accessToken}`}}
      break
    case services.facebook:
      requestURL = `https://graph.facebook.com/me?fields=email&access_token=${accessToken}`
      break 
  }

  return axios.get(requestURL,config)
    .then((result)=>{
      const data = result.data
      if(service === services.github){
        return data[0].email || null
      }else{
        return data.email || null
      }
    })

}

export function setAccessToken (service,accessToken) {
  localStorage.setItem(`accessToken_${service}`,accessToken)
}

export function getAccessToken (service,accessToken) {
  return localStorage.getItem(`accessToken_${service}`)
}