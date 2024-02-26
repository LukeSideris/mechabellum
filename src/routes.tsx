import React from 'react';

import App from './App.tsx'
import AboutPage from './about/About.tsx';
import ErrorPage from "./errorPage/routeError.tsx";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "about/",
        element: <AboutPage />
      },
    ],
  }

];

export default routes;