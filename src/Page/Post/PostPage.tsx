import React, { useEffect, useState } from 'react';
import * as postApi from '../../api/post';
import RichTextDisplay from '../../Component/Text/RichTextDisplay';
import { useParams, useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import { Button } from '@mui/material';
import { useAuth } from '../../Provider/AuthProvider';

const PostPage: React.FC = () => {
  const { category, id } = useParams<{ category: string, id: string }>();
  const [post, setPost] = useState<Post | null>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const getPost = async () => {
    const p = await postApi.getPostByCategory(id!, category!);
    setPost(p);
  };

  useEffect(() => {
    getPost();
  }, []);

  const handleEdit = () => {
    navigate(`/${category}/${id}/edit`);
  };


  if (!post) {
    return (
      <h1>Post does not exist!</h1>
    )
  } else {
    return (
      <div>
        {currentUser && <Button onClick={handleEdit}>EDIT</Button>}
        <RichTextDisplay post={post} />
      </div>
    )
  }
};

export default PostPage;
