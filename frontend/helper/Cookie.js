import cookie from 'js-cookie';

class Cookie {
  static set(name, value, expires = 1) {
    if (process.browser) {
      cookie.set(name, value, {expires});
    }
  }

  static get (name) {
    if (process.browser) {
      return cookie.get(name)
    }
  }

  static remove (name) {
    if (process.browser) {
      cookie.remove(name);
    }
  }
}

export default Cookie
