// storageService.js
// Provides an async wrapper around localStorage with in-memory fallback

const MEMORY_STORE_KEY = 'dh_master_json_v1';

const memory = {
  master: null,
};

const isLocalStorageAvailable = () => {
  try {
    const testKey = '__dh_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const storage = {
  async getMaster() {
    if (isLocalStorageAvailable()) {
      try {
        const raw = window.localStorage.getItem(MEMORY_STORE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (err) {
        console.error('storage:getMaster parse error', err);
        return null;
      }
    }
    return memory.master;
  },

  async saveMaster(payload) {
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(MEMORY_STORE_KEY, JSON.stringify(payload));
        return true;
      } catch (err) {
        console.error('storage:saveMaster error', err);
        memory.master = payload;
        return false;
      }
    }
    memory.master = payload;
    return false;
  },

  async clear() {
    if (isLocalStorageAvailable()) {
      window.localStorage.removeItem(MEMORY_STORE_KEY);
    }
    memory.master = null;
  },
};

export default storage;
