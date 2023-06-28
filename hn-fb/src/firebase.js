import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const config = {
  databaseURL: 'https://hacker-news.firebaseio.com',
  projectId: 'firebase-hacker-news',
};

const app = initializeApp(config);
const db = getDatabase(app);

export default db;
