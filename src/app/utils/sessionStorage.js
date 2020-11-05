/* eslint-disable no-restricted-globals */

const KEY_TOKEN = "userToken";

class SessionStorage {
  clear() {
    self.sessionStorage.clear();
  }

  logout() {
    self.sessionStorage.removeItem(KEY_TOKEN);
  }

  get authToken() {
    return self.sessionStorage.getItem(KEY_TOKEN);
  }

  set authToken(value) {
    self.sessionStorage.setItem(KEY_TOKEN, value);
  }
}

const instance = new SessionStorage();

export default instance;
