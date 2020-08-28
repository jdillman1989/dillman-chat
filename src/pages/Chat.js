import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { signout } from '../helpers/auth';
import UserList from '../components/UserList';
import Layout from '../components/Layout';

const Chat = () => {

	const [user] = useState( auth().currentUser );
	const [chats, setChats] = useState( [] );
	const [content, setContent] = useState( '' );
	const [readError, setReadError] = useState( null );
	const [writeError, setWriteError] = useState( null );

	const handleChange = ( event ) => {
		setContent( event.target.value );
	};

	const handleSignout = () => {
		setReadError( '' );
		try {
			signout();

			db.ref( 'registered/' + user.uid ).set({
				email: user.email,
				online: false
			});
		} catch (error) {
			setReadError( error.message );
		}
	};

	const handleSubmit = async ( event ) => {
		event.preventDefault();
		setWriteError( null );
		setContent( '' );
		try {
			if ( content !== '' ) {
				db.ref( 'chats' ).push( {
					content: content,
					timestamp: Date.now(),
					uid: user.uid,
					email: user.email
				} );
			}
		} catch (error) {
			setWriteError( error.message );
		}
	};

	useEffect( () => {
		setReadError( null );
		try {
			db.ref( 'chats' ).on( 'value', ( snapshot ) => {
				let chats = [];
				snapshot.forEach( ( snap ) => {
					chats.push( snap.val() );
				} );
				setChats( chats );
			} );
		} catch ( error ) {
			setReadError( error.message );
		}
	}, [] );

	return (
		<div>
			<div className='chat-top'>
				<div>
					<button onClick={handleSignout}>Sign Out</button>
				</div>
				<UserList/>
			</div>
			<Layout page='chat'>
				<div>
					<div className="chats">
						{ chats.map( chat => {
							return (
								<div key={chat.timestamp} className={`
									msg 
									${chat.uid === user.uid
										? 'current'
										: ''
									}
								`}>
									<span>{chat.email}</span>
									<p>{chat.content}</p>
								</div>
							)
						} ) }
					</div>
					<form className='chat-form' onSubmit={handleSubmit} autoComplete="off">
						<input 
							type="text" 
							name="message" 
							placeholder="Say something" 
							onChange={handleChange}
							value={content}
						/>
						<div className='left-align'>
							<button className='dill-btn' type="submit">Send</button>
							<p className='small'>Logged in as <strong>{user.email}</strong></p>
							{writeError ? <p>{writeError}</p> : null}
							{readError ? <p>{readError}</p> : null}
						</div>
					</form>
				</div>
			</Layout>
		</div>
	);
}

export default Chat;
