import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../services/firebase';
import { signout } from '../helpers/auth';
import Message from '../components/Message';
import UserList from '../components/UserList';
import Layout from '../components/Layout';

const Chat = () => {

	const [user] = useState( auth().currentUser );
	const [chats, setChats] = useState( [] );
	const [content, setContent] = useState( '' );
	const [readError, setReadError] = useState( null );
	const [chatScroll, setChatScroll] = useState( true );
	const [writeError, setWriteError] = useState( null );

	const chatWindow = useRef( null );

	window.addEventListener( 'beforeunload', () => {  
		db.ref( 'registered/' + user.uid ).set({
			email: user.email,
			online: false
		});
	} );

	const handleScroll = ( e ) => {
		let element = e.target
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			setChatScroll( true );
		} else {
			setChatScroll( false );
		}
	}

	const scrollToBottom = () => {
		chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
	}

	const handleChange = ( e ) => {
		setContent( e.target.value );
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

	const handleSubmit = async ( e ) => {
		e.preventDefault();
		setWriteError( null );
		setContent( '' );
		try {
			if ( content !== '' ) {
				await db.ref( 'chats' ).push( {
					content: content,
					timestamp: Date.now(),
					uid: user.uid,
					email: user.email
				} );

				if ( chatScroll ) {
					scrollToBottom();
				}
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
					const snapVal = snap.val();
					snapVal.msgid = snap.key;
					chats.push( snapVal );
				} );
				setChats( chats );

				scrollToBottom();

				db.ref( 'registered/' + user.uid ).set({
					email: user.email,
					online: true
				});
			} );
		} catch ( error ) {
			setReadError( error.message );
		}
	}, [user] );

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
					<div className="chats" onScroll={handleScroll} ref={chatWindow}>
						{ chats.map( chat => {
							return (
								<Message
									key={chat.timestamp}
									time={chat.timestamp}
									author={chat.email}
									userid={chat.uid}
									msgid={chat.msgid}
								>
									{chat.content}
								</Message>
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
