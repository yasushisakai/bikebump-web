import { firebaseStorage } from 'config/constants'

export function storeBlob(name,blob){
  const blobRef = firebaseStorage.child(name)
  blobRef.put(blob,{contentType:'audio/wav'})
    .then((snapshot)=>{console.log('uploaded.')})
}