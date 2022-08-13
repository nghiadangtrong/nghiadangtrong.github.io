import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from 'reactstrap';
import { APP_NAME } from '@/config';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import AuthAction from '@/actions/auth';
import { getUserInfo } from '@/helper/auth';
import { RoleType } from '@/helper/constant';
import NavbarBrandLink from '@/components/Navbar/NavbarBrandLink';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // import từ node_modules

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

Router.events.off('routeChangeStart', () => NProgress.remove());

const Header = () => {
  const [collapsed, setCollapsed] = useState(true);
  const user = getUserInfo();
  const router = useRouter();
  const toggleNavbar = () => setCollapsed(!collapsed);

  const onSignout = () => AuthAction.signout(() => router.replace('/signin'))

  const gotoDashboard = () => {
    let role = user ? user.role : null;
    switch (role) {
      case RoleType.user: return router.push('/user');
      case RoleType.admin: return router.push('/admin');
      default: return;
    }
  }

  const showWhen = (shoudShow) => (component) => shoudShow ? component() : null;

  return (
    <Navbar
      color="light"
      expand="md"
      light
    >
      <Link href="/" passHref>
        <NavbarBrandLink className="me-auto">
          {APP_NAME}
        </NavbarBrandLink>
      </Link>
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={collapsed} navbar>
        <Nav
          className="ms-auto"
          navbar
        >
          {showWhen(user)(() =>
            <NavItem>
              <NavLink className="btn" onClick={gotoDashboard}>
                {`${user.name}'s Dashboard`}
              </NavLink>
            </NavItem>
          )}
          <NavItem>
            <Link href="/blogs">
              <NavLink className="btn">
                Blogs
              </NavLink>
            </Link>
          </NavItem>
          {showWhen(user)(() =>
            <NavItem>
              <NavLink className="btn" onClick={onSignout}>
                Signout
              </NavLink>
            </NavItem>
          )}

          {showWhen(!user)(() =>
            <>
              <NavItem>
                <Link href="/signin">
                  <NavLink className="btn">
                    Signin
                  </NavLink>
                </Link>
              </NavItem>

              <NavItem>
                <Link href="/signup">
                  <NavLink className="btn">
                    Signup
                  </NavLink>
                </Link>
              </NavItem>
            </>
          )}

        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default Header;
