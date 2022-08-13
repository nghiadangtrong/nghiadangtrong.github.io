import { fetch } from '@/helper/http';
import Cookie from '@/helper/Cookie';

class Blog {
  headers = {};

  constructor() {
    const token = Cookie.get('token');
    this.headers = {
      'Authorization': `Bearer ${token}`
    }
  }

  async create(values) {
    return fetch({
      isFormData: true,
      method: 'post',
      url: '/api/blogs',
      headers: this.headers,
      values
    })
  }

  async getAll(values) {
    return fetch({
      method: 'get',
      url: '/api/blogs',
      headers: this.headers,
      values
    })
  }

  async get(slug) {
    return fetch({
      method: 'get',
      url: `/api/blogs/${slug}`,
      headers: this.headers,
    })
  }

  async getRelated(slug) {
    return fetch({
      method: 'get',
      url: `/api/blogs/related/${slug}`,
      headers: this.headers,
    })
  }

  async update(slug, values) {
    return fetch({
      isFormData: true,
      method: 'put',
      url: `/api/blogs/${slug}`,
      headers: this.headers,
      values
    })

  }

  async remove(slug) {
    return fetch({
      method: 'delete',
      url: `/api/blogs/${slug}`,
      headers: this.headers,
    })
  }
}

export default new Blog();
