import React from 'react';
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';


import classes from './SiteNav.module.css';

function SiteNav() {
  return (
    <nav className={classes.siteNav}>
      <ul>
        <li>
          <MenuTrigger>
            <Button >
              ☰ Menu
            </Button>
            <Popover>
              <Menu>
                <MenuItem className={classes.link} href="/">Home</MenuItem>
                <MenuItem className={classes.link} href="/about/">About</MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </li>
      </ul>
    </nav>
  );
}

export default SiteNav;
