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
import { Post, FirestorePost } from '../types';

export const getDbAccess = (): Firestore => {
  return fbConnect.exportDbAccess();
};

const createPost = async (): Promise<string> => {
  console.log('getDbAccess is called');
  console.log('getDbAccess()', getDbAccess());
  const docRef = await addDoc(collection(getDbAccess(), 'post'),
    {
      title: '',
      isPublic: false,
      body: '',
      created: new Date(),
      lastUpdated: new Date()
    });
  return docRef.id;
};

const updatePost = async (item: Post): Promise<void> => {
  console.log('updatePost called ', item)
  try {
    await updateDoc(doc(getDbAccess(), 'post', item.id), {
      title: item.title,
      isPublic: item.isPublic,
      body: item.body,
      lastUpdated: item.lastUpdated ? item.lastUpdated : new Date()
    });
  } catch (err) {
    console.error('error when updating item: ', err);
    throw err;
  }
};

const togglePostPublish = async (id: string, isPublic: boolean): Promise<boolean> => {
  try {
    await updateDoc(doc(getDbAccess(), 'post', id), {
      isPublic: isPublic
    });
    return true;
  } catch (err) {
    console.error('updating post public status is failing.');
    return false;
  }
};

const getPost = async (id: string): Promise<Post | null> => {
  const querySnapshot = await getDoc(doc(getDbAccess(), 'post', id));
  if (querySnapshot.exists()) {
    const data = querySnapshot.data() as FirestorePost;
    const post: Post = {
      id: querySnapshot.id,
      title: data.title,
      body: data.body,
      isPublic: data.isPublic,
      created: data.created.toDate(),
      lastUpdated: data.lastUpdated.toDate()
    };
    return post;
  } else {
    console.log('No document with id: ' + id + ' exists');
    return null;
  }
};

const getPosts = async (limitNum: number): Promise<Post[]> => {
  const posts: Post[] = [];
  let querySnapshot = await getDocs(collection(getDbAccess(), 'post'));
  if (limitNum > 0) {
    const q = query(collection(getDbAccess(), 'post'), limit(limitNum));
    querySnapshot = await getDocs(q);
  }
  querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
    const data = doc.data() as FirestorePost;
    if (data) {
      const post: Post = {
        id: doc.id,
        title: data.title,
        body: data.body,
        isPublic: data.isPublic,
        created: data.created.toDate(),
        lastUpdated: data.lastUpdated.toDate()
      };
      posts.push(post);
    }
  });

  return posts;
};

const getPublishedPosts = async (): Promise<Post[]> => {
  const posts: Post[] = [];
  const q = query(collection(getDbAccess(), 'post'),
    where('isPublic', '==', true));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
    const data = doc.data() as FirestorePost;
    if (data) {
      const post: Post = {
        id: doc.id,
        title: data.title,
        body: data.body,
        isPublic: data.isPublic,
        created: data.created.toDate(),
        lastUpdated: data.lastUpdated.toDate()
      };
      posts.push(post);
    }
  });

  return posts;
};

const deletePost = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(getDbAccess(), 'post', id));
    return true;
  } catch (err) {
    console.error('updating post public status is failing.');
    return false;
  }
};

export {
  createPost,
  updatePost,
  togglePostPublish,
  getPost,
  getPosts,
  getPublishedPosts,
  deletePost,
}  
