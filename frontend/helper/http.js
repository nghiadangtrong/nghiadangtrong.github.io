import isomorphicFetch from 'isomorphic-fetch';
import { API_HOST } from '@/config';

const makeQuery = (data = {}) => {
  if (Object.keys(data).length === 0) {
    return ''
  };

  let query = [];
  let stack = [];
  stack.push({ prefix: '', value: data })
  while (stack.length > 0) {
    let { prefix, value } = stack.pop();
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        let newPrefix = `${prefix}[]`
        if (typeof value[i] === 'object') {
          newPrefix = `${prefix}[${i}]`
        }
        stack.push({ prefix: newPrefix, value: value[i] })
      }
    } else if (typeof value === 'object') {
      for (let key in value) {
        let newPrefix = key;
        if (prefix || prefix.length > 0) {
          newPrefix = `${prefix}[${key}]`;
        }
        stack.push({ prefix: newPrefix, value: value[key] });
      }
    } else {
      query.unshift({ key: prefix, value: value })
    }
  }

  return '?' + query.map(item => `${item.key}=${item.value}`).join('&')
}

export const fetch = async ({ url, method, values, headers = {}, isFormData = false }) => {
  let result = {
    status: -1,
    data: null,
    error: null
  }
  method = String(method).trim().toUpperCase();
  try {
    let URI = `${API_HOST}${url}`;
    let options = {
      method,
      headers: isFormData
        ? {
          'Accept': 'application/json',
          ...headers
        }
        : {
          'Content-Type': 'application/json',
          ...headers
        },
      body: isFormData ? values : JSON.stringify(values)
    }

    if (method === 'GET') {
      delete options.body;
      URI = URI + makeQuery(values)
    }

    let response = await isomorphicFetch(URI, options);

    result['status'] = response.status;

    let responseJson = await response.json()
    if (response.status >= 200 && response.status < 300) {
      result['data'] = responseJson;
    } else {
      result['error'] = responseJson;
    }
  } catch (e) {
    result['error'] = { message: e.message || 'Something went wrong' }
  }

  return result;
}

export default {
  fetch
}
