// @flow
import { firebaseStorage } from 'config/constants';

export function storeBlob (name: string, blob: Blob): Promise<void> {
  const blobRef = firebaseStorage.child(name);
  return blobRef.put(blob, {contentType: 'audio/wav'})
    .then(() => { console.log(`${name} uploaded`); });
}
