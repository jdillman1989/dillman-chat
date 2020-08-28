import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signin } from '../helpers/auth';
import { auth, db } from '../services/firebase';
import Layout from '../components/Layout';

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

			const current = auth().currentUser;
			db.ref( 'registered/' + current.uid ).set({
				email: current.email,
				online: true
			});
		} catch (error) {
			setError( error.message );
		}
	};

	// Build the form view with the initial states
	return (
		<Layout page='login'>
			<div>
				<h1>Sign in to <Link to='/'>Dillman Chat</Link></h1>
				<form className='auth-form' onSubmit={handleSubmit}>
					<div className='auth-form__inputs'>
						<input 
							placeholder="Email" 
							type="email" 
							name="email" 
							onChange={handleEmailChange}
							value={email}
						/>

						<input 
							placeholder="password" 
							type="password" 
							name="password" 
							onChange={handlePasswordChange}
							value={password}
						/>
					</div>
					{error ? <p>{error}</p> : null}
					<div className='center-align'>
						<button className='dill-btn' type="submit">Sign in</button>
					</div>
					<br/>
					<p className='small'>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
				</form>
			</div>
		</Layout>
	)
}

export default Signin;