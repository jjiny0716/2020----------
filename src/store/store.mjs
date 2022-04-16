import { BASE_LOCAL_STORAGE_KEY } from "../constants.mjs";

class Store {
  setLocalStorage(key, value) {
    localStorage.setItem(`${BASE_LOCAL_STORAGE_KEY}-${key}`, value);
  }

  getLocalStorage(key) {
    return localStorage.getItem(`${BASE_LOCAL_STORAGE_KEY}-${key}`);
  }
}

export const store = new Store();