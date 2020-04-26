import firebase from 'firebase'
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase

