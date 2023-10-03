import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouteList from './RouteList';
import NarBar from './Component/NavBar/NarBar';
import { AuthProvider } from './Provider/AuthProvider';
import { PostsProvider } from './Provider/PostsProvider';
import NavBarMedium from './Component/NavBar/NavBarMedium';

const App: FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PostsProvider>
          <NavBarMedium />
          <RouteList />
        </PostsProvider>
      </AuthProvider>
    </BrowserRouter >
  )
}

export default App;
