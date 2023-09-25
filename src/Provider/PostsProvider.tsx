import React, { createContext, useContext, useState } from 'react';
import { Post } from '../types';  // Adjust the path accordingly

interface PostsContextProps {
  postsByCategory: { [category: string]: Array<Post> };
  setPostsByCategory: (category: string, posts: Array<Post>) => void;
  currentPageByCategory: { [category: string]: number };
  setCurrentPageByCategory: (category: string, pageNum: number) => void;
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  lastVisibleDocTimestamps: { [key: string]: number };
  setLastVisibleDocTimestamps: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const defaultValues: PostsContextProps = {
  postsByCategory: {},
  setPostsByCategory: () => { },
  currentPageByCategory: {},
  setCurrentPageByCategory: () => { },
  scrollPosition: 0,
  setScrollPosition: () => { },
  lastVisibleDocTimestamps: {},
  setLastVisibleDocTimestamps: () => { }
};

const PostsContext = createContext<PostsContextProps>(defaultValues);

export const usePosts = () => {
  return useContext(PostsContext);
};

type PostsProviderProps = {
  children: React.ReactNode;
};

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [postsByCategory, setInternalPostsByCategory] = useState<{ [category: string]: Array<Post> }>({});
  const [lastVisibleDocTimestamps, setLastVisibleDocTimestamps] = useState<{ [key: string]: number }>({});
  const [currentPageByCategory, setCurrentPageByCategoryState] = useState<{ [category: string]: number }>({});
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const setPostsByCategory = (category: string, posts: Array<Post>) => {
    setInternalPostsByCategory(prevState => ({
      ...prevState,
      [category]: posts
    }));
  };

  const setCurrentPageByCategory = (category: string, pageNum: number) => {
    setCurrentPageByCategoryState(prevState => ({
      ...prevState,
      [category]: pageNum
    }));
  };

  return (
    <PostsContext.Provider value={{
      postsByCategory,
      setPostsByCategory,
      currentPageByCategory,
      setCurrentPageByCategory,
      scrollPosition,
      setScrollPosition,
      lastVisibleDocTimestamps,
      setLastVisibleDocTimestamps
    }}>
      {children}
    </PostsContext.Provider>
  );
};
