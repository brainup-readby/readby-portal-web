import axios from "axios";
import localStorage from "app/utils/localStorage";
import sessionStorage from "app/utils/sessionStorage";

class API {

  constructor() {
    this._baseURL = process.env.REACT_APP_API_BASE_URL;
    this._basicAuthCredentials = {
      username: process.env.REACT_APP_BASIC_AUTH_USERNAME,
      password: process.env.REACT_APP_BASIC_AUTH_PASSWORD
    };
    this._withoutAuth = null;
    this._basicAuth = null;
    this._sessionAuth = null;
  }

  get baseURL() {
    return this._baseURL;
  }

  deleteSession() {
    this._sessionAuth = null;
  }

  get basicAuthCredentials() {
    return this._basicAuthCredentials;
  }

  get sessionAuth() {
    if (!this._sessionAuth) {
      this._sessionAuth = axios.create({
        baseURL: this.baseURL,
        headers: this.authHeaders
      });
      this._sessionAuth.defaults.timeout = 15000;
      this.addRequestInterceptopr(this._sessionAuth);
      this.addResponseInterceptopr(this._sessionAuth);
    }
    return this._sessionAuth;
  }

  get basicAuth() {
    if (!this._basicAuth) {
      this._basicAuth = axios.create({
        baseURL: this.baseURL,
        auth: this.basicAuthCredentials
      });
      this._basicAuth.defaults.timeout = 15000;
      this.addRequestInterceptopr(this._basicAuth);
      this.addResponseInterceptopr(this._basicAuth);
    }
    return this._basicAuth;
  }

  get withoutAuth() {
    if (!this._withoutAuth) {
      this._withoutAuth = axios.create({
        baseURL: this.baseURL
      });
      this._withoutAuth.defaults.timeout = 15000;
      this.addRequestInterceptopr(this._withoutAuth);
      this.addResponseInterceptopr(this._withoutAuth);
    }
    return this._withoutAuth;
  }

  addRequestInterceptopr(axiosInstance) {
    if (!axiosInstance) return null;
    axiosInstance.interceptors.request.use(
      function (config) {
        if (config && config.data && config.data.token === "") {
          localStorage.logout();
          let error = new Error("Session Expired!");
          setTimeout(() => {
            if (window) window.location = "/";
          }, 2000);
          return Promise.reject(error);
        }
        return config;
      }, function (error) {
        return Promise.reject(error);
      });
  }

  addResponseInterceptopr(axiosInstance) {
    if (!axiosInstance) return null;
    axiosInstance.interceptors.response.use(
      response => response,
      error => {
        let errorCode = error.response && error.response.status;
        if (errorCode) {
          let errorMessage = typeof error.response.data.response === "string" ? error.response.data.response : error.response.data && error.response.data.message;
          error = new Error(errorMessage || "Something went wrong!");
          if (errorCode === 401 || errorCode === 403) {
            localStorage.logout();
            setTimeout(() => {
              if (window) window.location = "/";
            }, 2000);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  get authHeaders() {
    return {
      "Authorization": "Bearer " + localStorage.authToken
    };
  }

  get sessionAuthHeader() {
    return {
      "Authorization": "Bearer " + sessionStorage.authToken
    };
  }

  showError(err, enqueueSnackbar, options = {}) {
    let errorMessage = typeof err === "string" ? err : err && err.message;
    errorMessage && enqueueSnackbar && enqueueSnackbar(errorMessage, options);
  }
}

const api = new API();

export default api;
