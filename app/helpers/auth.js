import { ref, firebaseAuth } from 'config/constants'
import firebase from 'firebase'

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
  return firebaseAuth.signOut()
}

function checkUserDuplicate (email) {
  // returns null if there is no users assigned
  // returns the uid if there is already one
  const userRef = ref.child('users').orderByChild('email').equalTo(email)
  return userRef.once('value').then((snapshot)=>{
    const uids = snapshot.val() || {}
    return Object.keys(uids)[0] || ''
    })
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
  return checkUserDuplicate(user.email)
    .then((uid)=>{
      console.log(uid)
      return uid === '' ? saveUser(user) : {...user,uid}
    })
}