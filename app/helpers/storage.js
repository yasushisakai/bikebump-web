import { firebaseStorage } from 'config/constants';

export function storeBlob (name, blob) {
  const blobRef = firebaseStorage.child(name);
  return blobRef.put(blob, {contentType: 'audio/wav'})
    .then(() => { console.log(`${name} uploaded`); });
}
