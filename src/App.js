import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { auth } from './services/firebase';
import './App.scss';

// Route unauthed visitors to the login page
const AuthRoute = ( path, authenticated, Component ) => {
	return (
		<Route
			path={path}
			render={ () => authenticated === true
				? Component
				: <Redirect to='/login' />}
		/>
	);
}

// Route authed visitors to the chat page
const PublicRoute = ( path, authenticated, Component ) => {
	return (
		<Route
			path={path}
			render={ () => authenticated === false
				? Component
				: <Redirect to='/chat' />}
		/>
	);
}

const App = () => {

	const [authenticated, setAuthenticated] = useState( false );
	const [loading, setLoading] = useState( true );

	// Watch firebase auth state
	useEffect( () => {
		auth().onAuthStateChanged( ( user ) => {
			if ( user ) {
				setAuthenticated( true );
				setLoading( false );
			} else {
				setAuthenticated( false );
				setLoading( false );	
			}
		} );
	} );

	// Build the view according to the route
	return loading === true ? <h2>Loading...</h2> : (
		<Router>
			<Switch>
				<Route exact path='/' component={Home} />
				{AuthRoute( '/chat', authenticated, <Chat/> )}
				{PublicRoute( '/signup', authenticated, <Signup/> )}
				{PublicRoute( '/login', authenticated, <Login/> )}
			</Switch>
		</Router>
	);
};

export default App;
