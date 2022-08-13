import { useEffect, useState } from 'react';
import Layout from '@/components/Layout/index';
import { getUserInfo } from '@/helper/auth';
import { RoleType } from '@/helper/constant';
import Router from 'next/router';

const AdminLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { checkAccept() }, [])

  const checkAccept = () => {
    let user = getUserInfo();
    if(!user) { return Router.replace('/signin') }

    let isAdmin = user.role === RoleType.admin;
    if(!isAdmin) { return Router.replace('/') }
    setLoading(false);
  }

  return <Layout>{loading ? '' : children}</Layout>
}

export default AdminLayout;
