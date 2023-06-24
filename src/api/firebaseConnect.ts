import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.storageBucket) {
  throw new Error('Missing Firebase configuration values. Check your environment variables.');
}

let firebaseApp: FirebaseApp;
let db: Firestore;
let auth: Auth;

export const init = (): void => {
  firebaseApp = initializeApp(firebaseConfig);
  if (!db) {
    db = getFirestore(firebaseApp);
  }
  if (!auth) {
    auth = getAuth(firebaseApp);
  }
};
init();

export const exportDbAccess = (): Firestore => {
  return db;
};

export const exportStorageAccess = (): FirebaseStorage => {
  return getStorage(firebaseApp);
};

export { auth };

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error: unknown) {
    throw new Error('Sign in failed!');
  }
};

export const signOutUser = (): void => {
  signOut(auth).then(() => {
    console.log('sign out successful!');
  }).catch((error) => {
    console.log('sign out has some error', error);
  });
};
