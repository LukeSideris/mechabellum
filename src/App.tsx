import { Outlet } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouterProvider } from 'react-aria-components';

import SiteNav from './navigation/SiteNav';

import classes from './App.module.css';

function App() {
  const navigate = useNavigate();
  const { pathname = '/' } = useLocation();
  const basePath = pathname.split('/')[1];

  return (
    <RouterProvider navigate={navigate}>
      <div className={`${classes.app} page-${basePath || 'home'}`}>
        <SiteNav />

        <main>
          <Outlet />
        </main>
      </div>
    </RouterProvider>
  );
}

export default App;
