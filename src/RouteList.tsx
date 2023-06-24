import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PostPage from './Page/Post/PostPage';
import EditPostPage from './Page/EditPost/EditPostPage';
import AdminSignInPage from './Page/Admin/AdminSignInPage';
import AdminPage from './Page/Admin/AdminPage';

const RouteList: FC = () => {
  return (
    <div className="page-container">
      <Routes>
        <Route path='/' element={<PostPage />} />
        <Route path='/post' element={<PostPage />} />
        <Route path='/signin' element={<AdminSignInPage />} />
        <Route path='/admin' element={<PrivateRoute />}>
          <Route path='/admin' element={<AdminPage />} />
        </Route>
        <Route path='/edit-post/:id' element={<PrivateRoute />}>
          <Route path='/edit-post/:id' element={<EditPostPage />} />
        </Route>
      </Routes>
    </div >
  );
};

export default RouteList;