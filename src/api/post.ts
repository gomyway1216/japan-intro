import * as fbConnect from './firebaseConnect';
import {
  addDoc,
  collection,
  collectionGroup,
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
  where,
  orderBy,
  startAfter
} from 'firebase/firestore';
import { Post, PartialPost, FirestorePost } from '../types';

export const getDbAccess = (): Firestore => {
  return fbConnect.exportDbAccess();
};

const getPostCategories = async (): Promise<Array<string>> => {
  const querySnapshot = await getDocs(collection(getDbAccess(), 'post'));
  const categories: Array<string> = [];
  querySnapshot.forEach((doc) => {
    categories.push(doc.id);
  });
  return categories;
};

const getAllCategoryPosts = async (isPublic?: boolean): Promise<Post[]> => {
  const categories = ["anime", "traveling", "culture", "food", "transportation", "song", "celebrity", "other", "pickUp"];

  // Create an array of promises
  const promises = categories.map(category => getPostsByCategory(category, isPublic));

  // Use Promise.all to wait for all promises to resolve
  const allPosts = await Promise.all(promises);

  // Flatten the array of posts arrays into a single array
  const combinedPosts: Post[] = allPosts.flat();

  return combinedPosts;
};

const getPosts = async (category: string, isPublic: boolean, pageNumber: number, limitNumber: number,
  lastVisibleDocTimestamps: { [key: string]: number },
  setLastVisibleDocTimestamps: (val: { [key: string]: number }) => void): Promise<Post[]> => {
  const startingPage = pageNumber - 1;
  const lastVisibleDocTimestampKey = `lastVisible_${category}_${startingPage}`;
  let lastVisibleDocTimestampSeconds = lastVisibleDocTimestamps[lastVisibleDocTimestampKey];
  let q;

  if (category === 'all') {
    if (startingPage === 0 || !lastVisibleDocTimestampSeconds) {
      q = query(
        collectionGroup(getDbAccess(), 'posts'),
        where('isPublic', '==', isPublic),
        orderBy('lastUpdated', 'desc'),
        limit(limitNumber)
      );
    } else {
      let lastVisibleTimestamp = Timestamp.fromDate(new Date(Number(lastVisibleDocTimestampSeconds) * 1000));
      q = query(
        collectionGroup(getDbAccess(), 'posts'),
        where('isPublic', '==', isPublic),
        orderBy('lastUpdated', 'desc'),
        startAfter(lastVisibleTimestamp),
        limit(limitNumber)
      );
    }
  } else {
    if (startingPage === 0 || !lastVisibleDocTimestampSeconds) {
      q = query(
        collection(getDbAccess(), `post/${category}/posts`),
        where('isPublic', '==', isPublic),
        orderBy('lastUpdated', 'desc'),
        limit(limitNumber)
      );
    } else {
      let lastVisibleTimestamp = Timestamp.fromDate(new Date(Number(lastVisibleDocTimestampSeconds) * 1000));
      q = query(
        collection(getDbAccess(), `post/${category}/posts`),
        where('isPublic', '==', isPublic),
        orderBy('lastUpdated', 'desc'),
        startAfter(lastVisibleTimestamp),
        limit(limitNumber)
      );
    }
  }

  const docs = await getDocs(q);
  if (docs.empty) {
    console.log('No more documents!');
    return [];
  }

  const newLastVisibleDocTimestampSeconds = docs.docs[docs.docs.length - 1].data().lastUpdated.seconds;
  const currentVisibleDocTimestampKey = `lastVisible_${category}_${pageNumber}`;
  const newLastVisibleDocTimestamps = {
    ...lastVisibleDocTimestamps,
    [currentVisibleDocTimestampKey]: newLastVisibleDocTimestampSeconds
  };
  setLastVisibleDocTimestamps(newLastVisibleDocTimestamps);

  // Map over the docs and convert any Firestore timestamps to JavaScript Date objects
  return docs.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      body: data.body,
      isPublic: data.isPublic,
      category: data.category,
      image: data.image,
      created: data.created?.toDate(),
      lastUpdated: new Date(data.lastUpdated.seconds * 1000) // Convert to JavaScript Date object
    };
  });
}



const getPostsByCategory = async (category: string, isPublic?: boolean): Promise<Post[]> => {
  const posts: Post[] = [];
  let q;

  if (isPublic !== undefined) {
    q = query(collection(getDbAccess(), `post/${category}/posts`), where('isPublic', '==', isPublic));
  } else {
    q = collection(getDbAccess(), `post/${category}/posts`);
  }

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
    const data = doc.data() as FirestorePost;

    try {
      const post: Post = {
        id: doc.id,
        title: data.title,
        body: data.body,
        isPublic: data.isPublic,
        created: data.created.toDate(),
        lastUpdated: data.lastUpdated.toDate(),
        category: category,
        image: data.image
      };
      posts.push(post);
    } catch (e) {
      console.error('error when getting post: ', e);
    }
  });

  return posts;
};

const createPost = async (post: Post): Promise<string> => {
  const docRef = await addDoc(collection(getDbAccess(), `post/${post.category}/posts`),
    {
      title: post.title,
      isPublic: post.isPublic,
      body: post.body,
      created: post.created,
      lastUpdated: post.lastUpdated,
      image: post.image
    });
  return docRef.id;
};

const updatePost = async (post: Post): Promise<void> => {
  try {
    await updateDoc(doc(getDbAccess(), `post/${post.category}/posts`, post.id), {
      title: post.title,
      isPublic: post.isPublic,
      body: post.body,
      lastUpdated: post.lastUpdated ? post.lastUpdated : new Date(),
      image: post.image
    });
  } catch (err) {
    console.error('error when updating item: ', err);
    throw err;
  }
};

const togglePostPublish = async (id: string, category: string, isPublic: boolean): Promise<boolean> => {
  try {
    await updateDoc(doc(getDbAccess(), `post/${category}/posts`, id), {
      isPublic: isPublic
    });
    return true;
  } catch (err) {
    console.error('updating post public status is failing.');
    return false;
  }
};

const getPostByCategory = async (id: string, category: string): Promise<Post | null> => {
  const querySnapshot = await getDoc(doc(getDbAccess(), `post/${category}/posts`, id));
  if (querySnapshot.exists()) {
    const data = querySnapshot.data() as FirestorePost;
    try {
      const post: Post = {
        id: querySnapshot.id,
        title: data.title,
        body: data.body,
        isPublic: data.isPublic,
        created: data.created.toDate(),
        lastUpdated: data.lastUpdated.toDate(),
        category: category,
        image: data.image
      };
      return post;
    } catch (e) {
      console.error('error when getting post: ', e);
      return null;
    }
  } else {
    console.log('No document with id: ' + id + ' exists');
    return null;
  }
};

const deletePostByCategory = async (id: string, category: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(getDbAccess(), `post/${category}/posts`, id));
    return true;
  } catch (err) {
    console.error('updating post public status is failing.');
    return false;
  }
};

export {
  getPostCategories,
  getAllCategoryPosts,
  getPostsByCategory,
  createPost,
  updatePost,
  togglePostPublish,
  getPostByCategory,
  deletePostByCategory,
  getPosts
}  
