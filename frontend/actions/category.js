import { fetch } from '@/helper/http';
import Cookie from '@/helper/Cookie';

class Category {
  headers = {};

  constructor() {
    const token = Cookie.get('token');
    this.headers = {
      'Authorization': `Bearer ${token}`
    }
  }

  async create(values = {}) {
    return fetch({
      method: 'post',
      url: '/api/categories',
      headers: this.headers,
      values
    })
  }

  async getAll() {
    return fetch({
      method: 'get',
      url: '/api/categories',
      headers: this.headers,
    })
  }

  async detail(slug) {
    return fetch({
      method: 'get',
      url: `/api/categories/${slug}`,
      headers: this.headers,
    })
  }

  async remove(slug) {
    return fetch({
      method: 'delete',
      url: `/api/categories/${slug}`,
      headers: this.headers,
    })
  }
}

export default new Category();
