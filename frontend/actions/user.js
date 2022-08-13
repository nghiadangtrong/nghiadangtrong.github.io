import { fetch } from '@/helper/http';
import Cookie from '@/helper/Cookie';
import LocalStorage from '@/helper/LocalStorage';

class User {
  headers = {}

  constructor () {
    const token = Cookie.get('token');
    if(token) {
      this.headers = {
        'Authorization': `Bearer ${token}`
      }
    }
  }

  async getProfile() {
    return fetch({
      method: 'get',
      url: '/api/user/profile',
      headers: this.headers,
    })
  }

  async getPublicProfile (username) {
    return fetch({
      method: 'get',
      url: `/api/user/public-profile/${username}`,
      headers: this.headers
    })
  }

  async updateProfile (username, values) {
    return fetch({
      isFormData: true,
      method: 'put',
      url: `/api/user/update-profile/${username}`,
      headers: this.headers,
      values
    }).then((data) => {
        LocalStorage.set('user', data.data)
        return data;
      })
  }

  async updatePassword (values) {
    return fetch({
      method: 'put',
      url: '/api/user/update-password',
      headers: this.headers,
      values
    })
  }
}

export default new User();
