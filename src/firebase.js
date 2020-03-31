import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyDyYrvIVWD68HvzFmKE0TYYJSpAV2zSzv4",
    authDomain: "rainbowhunt-b14d6.firebaseapp.com",
    databaseURL: "https://rainbowhunt-b14d6.firebaseio.com",
    projectId: "rainbowhunt-b14d6",
    storageBucket: "rainbowhunt-b14d6.appspot.com",
    messagingSenderId: "922619653234",
    appId: "1:922619653234:web:3c465d714eeb196559e6eb",
    measurementId: "G-RPNDT8J0DM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase

