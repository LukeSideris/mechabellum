import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components';
import { useLocation } from 'react-router-dom';

import classes from './SiteNav.module.css';

function SiteNav() {
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <nav className={classes.siteNav}>
      <MenuTrigger>
        <Button aria-label="Site navigation menu"><span className={classes.hamburger}>☰</span> Menu</Button>
        <Popover>
          <Menu>
            <MenuItem className={classes.link} href="/" data-active={pathname === '/'}>
              Combat Calculator
            </MenuItem>
            <MenuItem className={classes.link} href="/about/" data-active={pathname === '/about/'}>
              About
            </MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
    </nav>
  );
}

export default SiteNav;
