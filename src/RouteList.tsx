import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PostPage from './Page/Post/PostPage';
import EditPostPage from './Page/EditPost/EditPostPage';
import AdminSignInPage from './Page/Admin/AdminSignInPage';
import AdminPage from './Page/Admin/AdminPage';
import HomePage from './Page/Home/HomePage';
import CategoryPostPage from './Page/Home/CategoryPostPage'

const RouteList: FC = () => {
  return (
    <div className="page-container">
      <Routes>
        <Route path='/' element={<CategoryPostPage />} />
        <Route path='/:category' element={<CategoryPostPage />} />
        <Route path='/:category/:id' element={<PostPage />} />
        <Route path='/:category/:id/edit' element={<PrivateRoute />}>
          <Route path='/:category/:id/edit' element={<EditPostPage />} />
        </Route>
        <Route path='/new-post' element={<PrivateRoute />}>
          <Route path='/new-post' element={<EditPostPage />} />
        </Route>
        <Route path='/signin' element={<AdminSignInPage />} />
        <Route path='/admin' element={<PrivateRoute />}>
          <Route path='/admin' element={<AdminPage />} />
        </Route>
      </Routes>
    </div >
  );
};

export default RouteList;