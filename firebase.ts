import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDrYVGyDnOwThal2wHqE95Pghobn2T__bY",
	authDomain: "interactive-comments-758ae.firebaseapp.com",
	databaseURL:
		"https://interactive-comments-758ae-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "interactive-comments-758ae",
	storageBucket: "interactive-comments-758ae.appspot.com",
	messagingSenderId: "517953182930",
	appId: "1:517953182930:web:5880cc479a06ca54e0210b",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export default app;
