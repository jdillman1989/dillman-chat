import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup, googleSignup } from '../helpers/auth';
import { auth, db } from '../services/firebase';
import Layout from '../components/Layout';

const Signup = () => {

	const [error, setError] = useState( null );
	const [email, setEmail] = useState( '' );
	const [password, setPassword] = useState( '' );
	const [confirmPassword, setConfirmPassword] = useState( '' );

	const handleEmailChange = ( event ) => {
		setEmail( event.target.value );
	};

	const handlePasswordChange = ( event ) => {
		setPassword( event.target.value );
	};

	const handleConfirmPasswordChange = ( event ) => {
		setConfirmPassword( event.target.value );
	};

	// Call our wrappers for the firebase signin method
	const handleSubmit = async ( event ) => {
		event.preventDefault();
		setError( '' );
		if ( password === confirmPassword && confirmPassword !== '' ) {
			try {
				await signup( email, password );

				const newUser = auth().currentUser;
				db.ref( 'registered/' + newUser.uid ).set({
					email: email,
					online: true
				});
			} catch (error) {
				setError( error.message );
			}
		} else {
			setError( 'Password confirm does not match.' );
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
		<Layout page='signup'>
			<div>
				<h1>Sign up to <Link to='/'>Dillman Chat</Link></h1>
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

						<input 
							placeholder="confirm password" 
							type="password" 
							name="confirm-password" 
							onChange={handleConfirmPasswordChange}
							value={confirmPassword}
						/>
					</div>
					{error ? <p>{error}</p> : null}
					<div className='center-align'>
						<button className='dill-btn' type="submit">Sign up</button>
						<p>or</p>
						<button className='dill-btn' onClick={googleSignin}>
							Connect with Google
						</button>
					</div>
					<br/>
					<p className='small'>Already have an account? <Link to='/login'>Sign In</Link></p>
				</form>
			</div>
		</Layout>
	)
}

export default Signup;