import Cookie from './Cookie';
import LocalStorage from './LocalStorage';
import { RoleType } from './constant';

export const getUserInfo = () => {
  let token = Cookie.get('token');
  if(!token) return null;

  let user = LocalStorage.get('user');
  if(!user) return null;

  return user;
}

export const isAuth = () => {
  return !!getUserInfo();
}

export const isAdmin = () => {
  let user = getUserInfo() || {};
  return user.role === RoleType.admin;
}

export default { isAuth }
