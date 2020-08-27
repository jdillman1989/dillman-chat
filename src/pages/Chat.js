import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { db } from '../services/firebase';
import { signout } from '../helpers/auth';

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
		} catch (error) {
			setReadError( error.message );
		}
	};

	const handleSubmit = async ( event ) => {
		event.preventDefault();
		setWriteError( null );
		setContent( '' );
		try {
			db.ref( 'chats' ).push( {
				content: content,
				timestamp: Date.now(),
				uid: user.uid
			} );
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
			<div className="chats">
				{
					chats.map( chat => {
						return (
							<p key={chat.timestamp}>{chat.content}</p>
						)
					} )
				}
			</div>
			<form onSubmit={handleSubmit} autoComplete="off">
				<input 
					type="text" 
					name="message" 
					placeholder="Say something" 
					onChange={handleChange}
					value={content}
				/>
				{writeError ? <p>{writeError}</p> : null}
				{readError ? <p>{readError}</p> : null}
				<button type="submit">Send</button>
			</form>
			<div>
				<p>Logged in as <strong>{user.email}</strong></p>
				<button onClick={handleSignout}>Sign Out</button>
			</div>
		</div>
	);
}

export default Chat;
