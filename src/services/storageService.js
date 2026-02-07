// storageService.js
// Provides an async wrapper around IndexedDB with in-memory fallback

import { openDB } from 'idb';

const DB_NAME = 'DesktopHotelDB';
const DB_VERSION = 1;
const STORE_NAME = 'master';
const MASTER_KEY = 'dh_master_json_v1';
const LOCALSTORAGE_KEY = 'dh_master_json_v1'; // For migration

const memory = {
  master: null,
};

let dbPromise = null;

// Initialize IndexedDB
const initDB = async () => {
  if (dbPromise) return dbPromise;

  try {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });

    // Migrate data from localStorage to IndexedDB if exists
    await migrateFromLocalStorage();

    return dbPromise;
  } catch (error) {
    console.error('IndexedDB initialization failed:', error);
    dbPromise = null;
    return null;
  }
};

// Migrate existing localStorage data to IndexedDB
const migrateFromLocalStorage = async () => {
  try {
    // Check if localStorage has data
    const localStorageData = window.localStorage.getItem(LOCALSTORAGE_KEY);
    if (!localStorageData) return;

    const db = await dbPromise;
    if (!db) return;

    // Check if IndexedDB already has data
    const existingData = await db.get(STORE_NAME, MASTER_KEY);
    if (existingData) return; // Don't overwrite existing IndexedDB data

    // Migrate from localStorage to IndexedDB
    const parsedData = JSON.parse(localStorageData);
    await db.put(STORE_NAME, parsedData, MASTER_KEY);
    
    console.log('Successfully migrated data from localStorage to IndexedDB');
    
    // Optionally clear localStorage after successful migration
    window.localStorage.removeItem(LOCALSTORAGE_KEY);
  } catch (error) {
    console.error('Error migrating from localStorage:', error);
  }
};

// Check if IndexedDB is available
const isIndexedDBAvailable = () => {
  try {
    return typeof indexedDB !== 'undefined';
  } catch (e) {
    return false;
  }
};

const storage = {
  async getMaster() {
    if (isIndexedDBAvailable()) {
      try {
        const db = await initDB();
        if (!db) throw new Error('Database not initialized');
        
        const data = await db.get(STORE_NAME, MASTER_KEY);
        return data || null;
      } catch (err) {
        console.error('storage:getMaster IndexedDB error', err);
        return memory.master;
      }
    }
    return memory.master;
  },

  async saveMaster(payload) {
    if (isIndexedDBAvailable()) {
      try {
        const db = await initDB();
        if (!db) throw new Error('Database not initialized');
        
        await db.put(STORE_NAME, payload, MASTER_KEY);
        return true;
      } catch (err) {
        console.error('storage:saveMaster IndexedDB error', err);
        memory.master = payload;
        return false;
      }
    }
    memory.master = payload;
    return false;
  },

  async clear() {
    if (isIndexedDBAvailable()) {
      try {
        const db = await initDB();
        if (db) {
          await db.delete(STORE_NAME, MASTER_KEY);
        }
      } catch (err) {
        console.error('storage:clear IndexedDB error', err);
      }
    }
    memory.master = null;
    
    // Also clear localStorage for complete cleanup
    try {
      window.localStorage.removeItem(LOCALSTORAGE_KEY);
    } catch (e) {
      // Ignore localStorage errors
    }
  },
};

export default storage;
