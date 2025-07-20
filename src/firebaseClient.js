// src/firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update, remove, onValue, push} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApDvF3Y59XfO6w4mNDr44DkaO7FKe9jho",
  authDomain: "frontend-spg.firebaseapp.com",
  databaseURL: "https://frontend-spg-default-rtdb.firebaseio.com",
  projectId: "frontend-spg",
  storageBucket: "frontend-spg.appspot.com",
  messagingSenderId: "988189347575",
  appId: "1:988189347575:web:21ecbffc732315a2244df2",
  measurementId: "G-0J7DVZDGZ2"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// Akses global (opsional)
if (typeof window !== "undefined") {
  window.firebaseDB = db;
}

export {
  db,
  ref,
  get,
  set,
  update,
  remove,
  onValue,
  push,
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL
};
