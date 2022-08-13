import { API_HOST } from '@/config';

const makeApiUrl = (paths = []) => ([API_HOST, ...paths].join('/'));

export {
  makeApiUrl
}
