import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouteList from './RouteList';
import NarBar from './Component/NavBar/NarBar';
import { AuthProvider } from './Provider/AuthProvider';

const App: FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NarBar />
        <RouteList />
      </AuthProvider>
    </BrowserRouter >
  )
}

export default App;
