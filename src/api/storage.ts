import * as fbConnect from './firebaseConnect';
import { Firestore } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes, FirebaseStorage, StorageReference } from 'firebase/storage';

export const getDbAccess = (): Firestore => {
  return fbConnect.exportDbAccess();
};

export const getImageRef = async (file: File): Promise<string> => {
  const storage: FirebaseStorage = fbConnect.exportStorageAccess();
  const fileRef: StorageReference = await ref(storage, 'post/' + file.name);

  // 'file' comes from the Blob or File API
  await uploadBytes(fileRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });

  const downloadURL: string = await getDownloadURL(fileRef);
  return downloadURL;
};