import React from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { RouterProvider } from 'react-aria-components';


import SiteNav from './navigation/SiteNav';

import classes from './App.module.css';

function App() {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate}>
      <div className={classes.app}>
        <SiteNav />

        <main>
          <Outlet />
        </main>
      </div>
    </RouterProvider>
  );
}

export default App;
