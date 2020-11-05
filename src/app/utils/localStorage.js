/* eslint-disable no-restricted-globals */

const KEY_TOKEN = 'userToken';

class LocalStorage {

  clear() {
    self.localStorage.clear();
  }

  logout() {
    self.localStorage.removeItem(KEY_TOKEN);
  }

  get isLoggedIn() {
    return !!this.authToken;
  }

  get authToken() {
    return self.localStorage.getItem(KEY_TOKEN) || "";
  }

  set authToken(value) {
    self.localStorage.setItem(KEY_TOKEN, value);
  }
}

const instance = new LocalStorage()

export default instance
