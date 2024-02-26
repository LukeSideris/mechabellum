import React from 'react';
import { NavLink } from 'react-router-dom';

function SiteNav() {
  return (
    <nav>
      <ul role="menu">
        <li role="menuitem"><NavLink to="/about/">About</NavLink></li>
      </ul>
    </nav>
  );
};

export default SiteNav;