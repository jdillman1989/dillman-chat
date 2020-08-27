import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signin } from '../helpers/auth';

const Signin = () => {

	const [error, setError] = useState( null );
	const [email, setEmail] = useState( '' );
	const [password, setPassword] = useState( '' );

	const handleEmailChange = ( event ) => {
		setEmail( event.target.value );
	};

	const handlePasswordChange = ( event ) => {
		setPassword( event.target.value );
	};

	// Call our wrappers for the firebase signin method
	const handleSubmit = async ( event ) => {
		event.preventDefault();
		setError( '' );
		try {
			await signin( email, password );
		} catch (error) {
			setError( error.message );
		}
	};

	// Build the form view with the initial states
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Sign in to <Link to='/'>Dillman Chat</Link></h1>
				<div>
					<input 
						placeholder="Email" 
						type="email" 
						name="email" 
						onChange={handleEmailChange}
						value={email}
					/>
				</div>
				<div>
					<input 
						placeholder="password" 
						type="password" 
						name="password" 
						onChange={handlePasswordChange}
						value={password}
					/>
				</div>
				<div>
					{error ? <p>{error}</p> : null}
					<button type="submit">Sign in</button>
				</div>
				<hr/>
				<p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
			</form>
		</div>
	)
}

export default Signin;