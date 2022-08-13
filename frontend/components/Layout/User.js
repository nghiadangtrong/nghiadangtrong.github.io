import { useEffect } from 'react';
import Layout from './index';
import { isAuth } from '@/helper/auth';
import Router from 'next/router';

const UserLayout = ({ children }) => {
  useEffect(() => (!isAuth() && Router.replace('/signin')))
  return (
    <Layout>{children}</Layout>
  )
}

export default UserLayout;
