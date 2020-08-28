import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Home = () => {

	return (
		<Layout page='home'>
			<div>
				<h1>Welcome to Dillman Chat</h1>
				<p>New here? <Link to='/signup'>Sign up</Link></p>
				<p>Join the conversation! <Link to='/login'>Sign in</Link></p>
			</div>
		</Layout>
	)
}

export default Home;