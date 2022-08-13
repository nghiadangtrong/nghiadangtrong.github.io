import { fetch } from '@/helper/http';
import Cookie from '@/helper/Cookie';
import LocalStorage from '@/helper/LocalStorage';

const signup = async (values = {}) => (
  fetch({
    method: 'post',
    url: '/api/signup',
    values
  })
)

const signin = async (values = {}) => (
  fetch({
    method: 'post',
    url: '/api/signin',
    values
  })
)

const signout = async (next) => {
  Cookie.remove('token');
  LocalStorage.remove('user');
  return fetch({
    method: 'post',
    url: '/api/signout'
  }).then(() => {
    console.log('logout success')
    next();
  }).catch((error) => {
    console.log('erorr', error)
    next()
  })
}

export const authenticate = (data = {}, next) => {
  let { token, user } = data;
  Cookie.set('token', token);
  LocalStorage.set('user', user);
  next();
}

export default {
  signup, signin, signout, authenticate,
}
