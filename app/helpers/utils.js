export function formatUser(userData) {
  return {
    name: userData.displayName,
    email: userData.email,
    avatar: userData.photoURL,
    uid: userData.uid,
  }
}

export function insertCSSLink(url){
  let head = document.head
  let link = document.createElement('link')

  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url

  head.appendChild(link)
}
