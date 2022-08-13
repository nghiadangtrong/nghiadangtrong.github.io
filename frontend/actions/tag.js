import { fetch } from '@/helper/http'
import Cookie from '@/helper/Cookie';

class Tag {
  headers = {}

  constructor() {
    const token = Cookie.get('token');
    this.headers = {
      'Authorization': `Bearer ${token}`,
    }
  }

  async getAll() {
    return fetch({
      method: 'get',
      url: '/api/tags',
      headers: this.headers,
    })
  }

  async detail(slug) {
    return fetch({
      method: 'get',
      url: `/api/tags/${slug}`,
      headers: this.headers,
    })
  }

  async create(values) {
    return fetch({
      method: 'post',
      url: '/api/tag',
      headers: this.headers,
      values
    })
  }

  async delete(slug) {
    return fetch({
      method: 'delete',
      url: `/api/tag/${slug}`,
      headers: this.headers,
    })
  }
}

export default new Tag();
