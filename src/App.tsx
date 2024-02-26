import React from 'react'
import { Outlet } from "react-router-dom";

import SiteNav from './navigation/SiteNav';

import classes from './App.module.css'

function App() {
  return (
    <div className={classes.app}>
      <SiteNav />
      
      <Outlet />
      test
    </div>
  )
};

export default App;
