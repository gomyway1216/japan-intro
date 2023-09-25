import React, { FC } from 'react';
import * as api from '../../api/post';
import { useParams } from 'react-router-dom';
import RichTextEditor from '../../Component/Edit/RichTextEditor';
// import RichTextEditor2 from '../../Component/Edit/RichTextEditor2';
import PostEditor from '../../Component/Edit/PostEditor';

const EditPostPage: FC = () => {
  const { category, id } = useParams<{ category: string, id: string }>();

  return (
    // <RichTextEditor
    //   category={category!}
    //   postId={id!}
    //   getPost={api.getPostByCategory}
    //   createPost={api.createPost}
    //   updatePost={api.updatePost}
    //   deletePost={api.deletePostByCategory}
    // />
    <PostEditor
      category={category!}
      postId={id!}
      getPost={api.getPostByCategory}
      createPost={api.createPost}
      updatePost={api.updatePost}
      deletePost={api.deletePostByCategory}
    />
    // <RichTextEditor2 />
  );
};

export default EditPostPage;
