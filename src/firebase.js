import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyCegWzrCHgrYzEqVpk36NmbBQYaJrOojNI',
	authDomain: 'to-do-list-app-42f3e.firebaseapp.com',
	projectId: 'to-do-list-app-42f3e',
	storageBucket: 'to-do-list-app-42f3e.appspot.com',
	messagingSenderId: '975438580194',
	appId: '1:975438580194:web:5bc6d67f7f461d0a6551bb'
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// https://to-do-list-app-7b087-default-rtdb.europe-west1.firebasedatabase.app
// https://to-do-list-app-7b087-default-rtdb.europe-west1.firebasedatabase.app/
// https://to-do-list-app-7b087-default-rtdb.firebaseio.com