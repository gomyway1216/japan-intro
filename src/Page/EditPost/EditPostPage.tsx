import React, { FC } from 'react';
import * as api from '../../api/post';
import { useParams } from 'react-router-dom';
import RichTextEditor from '../../Component/Edit/RichTextEditor';

const EditPostPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  // if `id` is undefined, it will default to an empty string
  const postId = id ?? '';

  return (
    <RichTextEditor
      id={postId}
      getDoc={api.getPost}
      updateDoc={api.updatePost}
      deleteDoc={api.deletePost}
    />
  );
};

export default EditPostPage;
