
class LocalStorage {
  static set(name, value) {
    if(process.browser) {
      localStorage.setItem(name, JSON.stringify(value))
    }
  }
  static get(name) {
    if(process.browser) {
      let dataString = localStorage.getItem(name)
      return dataString ? JSON.parse(dataString) : null;
    }
  }
  
  static remove(name) {
    if(process.browser) {
      localStorage.removeItem(name)
    }
  }
}

export default LocalStorage;
