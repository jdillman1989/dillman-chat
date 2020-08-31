import React, { useState } from 'react';
import { auth, db } from '../services/firebase';

const Message = ( props ) => {

	const [user] = useState( auth().currentUser );
	const [editing, setEditing] = useState( false );
	const [writeError, setWriteError] = useState( null );
	const [content, setContent] = useState( props.children );

	const handleEdit = () => {
		setEditing( true );
	};

	const handleChange = ( e ) => {
		setContent( e.target.value );
	};

	const handleSubmit = async ( e ) => {
		e.preventDefault();
		setWriteError( null );
		try {
			await db.ref( 'chats/' + props.msgid ).set({
				content: content,
				timestamp: props.time,
				uid: user.uid,
				email: user.email
			});
			setEditing( false );
		} catch (error) {
			setWriteError( error.message );
		}
	};

	return (
		<div className={`
			msg 
			${props.userid === user.uid
				? 'current'
				: ''
			}
		`}>
			<span>{props.author}</span>
			<div className='p'>
				{props.userid === user.uid
					? <button className='edit' onClick={handleEdit}></button>
					: ''
				}
				{writeError}
				{editing
					? <form onSubmit={handleSubmit} autoComplete="off">
						<input 
							type="text" 
							name="edit-message" 
							onChange={handleChange}
							value={content}
						/>
						<button className='edit-submit' onClick={handleSubmit}></button>
					</form>
					: props.children
				}
			</div>
		</div>
	);
}

export default Message;
