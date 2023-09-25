import React, { useEffect, useState, useRef } from 'react';
import { Post } from '../../types';
import PostListItem from '../../Component/Post/PostListItem';
import * as postApi from '../../api/post';
import SuggestionBar from './SuggestionBar';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../../Provider/PostsProvider';

const CategoryPostPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  // Getting values and functions from the context
  const {
    postsByCategory,
    setPostsByCategory,
    currentPageByCategory,
    setCurrentPageByCategory,
    scrollPosition,
    setScrollPosition,
    lastVisibleDocTimestamps,
    setLastVisibleDocTimestamps
  } = usePosts();

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To determine if there are more posts to fetch
  const [tabValue, setTabValue] = useState<string | undefined>(category);

  const getPageLimitBasedOnScreenSize = () => {
    return 5;
    // if (window.innerWidth <= 480) {  // Small devices (e.g., mobile phones)
    //   return 5;
    // } else if (window.innerWidth <= 768) {  // Medium devices (e.g., tablets)
    //   return 10;
    // } else {  // Large devices (e.g., desktops)
    //   return 20;
    // }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    const pageLimit = getPageLimitBasedOnScreenSize();
    const currentCategoryPage = currentPageByCategory[category as string] || 1;
    const fetchedPosts = await postApi.getValues(category as string, true, currentCategoryPage, pageLimit, lastVisibleDocTimestamps,
      setLastVisibleDocTimestamps);

    if (fetchedPosts.length === 0) {
      setHasMore(false);
    } else {
      // Combining existing posts with the newly fetched ones
      const updatedPosts = [...(postsByCategory[category as string] || []), ...fetchedPosts];
      setPostsByCategory(category as string, updatedPosts);

      setCurrentPageByCategory(category as string, currentCategoryPage + 1);
    }

    setIsLoading(false);
  };

  const handleClickPost = (id: string) => {
    setScrollPosition(window.scrollY); // Store scroll position when navigating away
    navigate(`/${category}/${id}`);
  };

  // When the component mounts or when category changes:
  useEffect(() => {
    if (!postsByCategory[category as string]) {
      fetchPosts();
    } else {
      window.scrollTo(0, scrollPosition);
    }
  }, [category]);

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 10 || isLoading || !hasMore) {
        return;
      }
      fetchPosts();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, postsByCategory, category]);

  return (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <div
        className="postsList"
        style={{
          borderRight: "solid 1px rgba(242, 242, 242, 1)",
          width: "69%",
          paddingTop: "3vh",
          minHeight: "97vh",
          display: "flex",
          flexDirection: "column",
          gap: "38px",
          marginRight: "auto",
        }}
      >
        <SuggestionBar activeTab={tabValue} setActiveTab={setTabValue} />
        <div
          className="inner_container_main"
          style={{
            width: "90%",
            marginRight: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            marginTop: "22px"
          }}
        >
          {postsByCategory[category as string]?.map((item) => {
            return (
              <PostListItem
                key={item.id}
                id={item.id}
                title={item.title}
                body={item.body}
                isPublic={item.isPublic}
                created={item.created}
                lastUpdated={item.lastUpdated}
                category={item.category}
                image={item.image}
                handleClick={handleClickPost}
              />
            );
          })}
          {isLoading && <p>Loading more posts...</p>}
        </div>
      </div>
      <div
        className="rightbar"
        style={{
          width: "31%",
          paddingTop: "3vh",
          display: "flex",
          flexDirection: "column",
          gap: "38px",
        }}
      >
        Placeholder for rightbar
      </div>
    </div>
  );

}

export default CategoryPostPage;