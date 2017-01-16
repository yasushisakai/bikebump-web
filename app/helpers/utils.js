

export function formatUser (userData) {
  return {
    name: userData.displayName,
    email: userData.email,
    avatar: userData.photoURL,
    uid: userData.uid,
  }
}