import firebase from 'firebase';

const firebaseConfig = {
	apiKey: 'AIzaSyCfZwZBl9qqFqZSVJtyAm4lYtnqsbN5S8s',
	authDomain: 'dillman-chat.firebaseapp.com',
	databaseURL: 'https://dillman-chat.firebaseio.com'
};

firebase.initializeApp( firebaseConfig );
export const auth = firebase.auth;
export const db = firebase.database();