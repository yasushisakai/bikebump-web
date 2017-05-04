import { ref, firebaseAuth } from 'config/constants'
import axios from 'axios'

const {
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} = firebaseAuth

export const services = {
  google: 'google',
  github: 'github',
  facebook: 'facebook',
}

export function auth (service = 'google') {
  let provider
  switch (service) {
    case services.google:
      provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      break
    case services.github:
      provider = new GithubAuthProvider()
      provider.addScope('user:email')
      break
    case services.facebook:
      provider = new FacebookAuthProvider()
      provider.addScope('email')
      break
  }
  sessionStorage.setItem('redirectAuth', 'true')
  localStorage.setItem('provider', service)
  // returns void
  return firebaseAuth().signInWithRedirect(provider)
}

export function redirectAuth () {
  return firebaseAuth().getRedirectResult()
    .then(({credential, user}) => {
      sessionStorage.removeItem('redirectAuth')

      return user
    })
    .catch((error) => {
      console.log(error)
      // this is now unlikely to happen
      if (error.code === 'auth/account-exists-with-different-credential') {
        const pendCred = error.credential
        const email = error.email
        firebaseAuth().fetchProvidersForEmail(email)
          .then((providers) => {
            redirectAuth(providers[0].split('.')[0])
          })
      }
    })
}

export function getCurrentUser () {
  return Promise.resolve(firebaseAuth().currentUser)
}

export function logout () {
  return firebaseAuth().signOut()
}

export function checkIfAuthed (store) {
  return store.getState().users.get('isAuthed') === true
}
