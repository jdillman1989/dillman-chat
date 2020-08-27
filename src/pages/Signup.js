import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup, googleSignup } from '../helpers/auth';

const Signup = () => {

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
			await signup( email, password );
		} catch (error) {
			setError( error.message );
		}
	};

	const googleSignin = async ( event ) => {
		event.preventDefault();
		try {
			await googleSignup();
		} catch (error) {
			setError( error.message );
		}
	}

	// Build the form view with the initial states
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Sign up to <Link to='/'>Dillman Chat</Link></h1>
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
					<button type="submit">Sign up</button>
					<p>or</p>
					<button onClick={googleSignin}>
						Sign up with your Google account
					</button>
				</div>
				<hr/>
				<p>Already have an account? <Link to='/login'>Sign In</Link></p>
			</form>
		</div>
	)
}

export default Signup;