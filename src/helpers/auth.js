import { auth } from '../services/firebase';
import firebase from 'firebase';

// Call firebase to handle our registration
const signup = ( email, password ) => {
	return auth().createUserWithEmailAndPassword( email, password );
};

// Call firebase to handle our authentication
const signin = ( email, password ) => {
	return auth().signInWithEmailAndPassword( email, password );
};

// Call firebase to handle our registration
const signout = () => {
	return auth().signOut();
};

const googleSignup = () => {
	const provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope( 'email' );
	return auth().signInWithPopup( provider );
};

export { signup, signin, signout, googleSignup }