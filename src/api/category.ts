import * as fbConnect from './firebaseConnect';
import {
  addDoc,
  collection,
  Timestamp,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where
} from 'firebase/firestore';

export const getDbAccess = (): Firestore => {
  return fbConnect.exportDbAccess();
}

export const getCategories = async (): Promise<Array<string>> => {
  const querySnapshot = await getDocs(collection(getDbAccess(), 'category'));
  const categories: Array<string> = [];
  querySnapshot.forEach((doc) => {
    categories.push(doc.data().name);
  });
  return categories;
}


