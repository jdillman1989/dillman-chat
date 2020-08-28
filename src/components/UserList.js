import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';

const UserList = () => {

	const [userList, setUserList] = useState( [] );
	const [readError, setReadError] = useState( null );

	useEffect( () => {
		setReadError( null );
		try {
			db.ref( 'registered' ).on( 'value', ( snapshot ) => {
				let userList = [];
				snapshot.forEach( ( snap ) => {
					userList.push( snap.val() );
				} );
				setUserList( userList );
			} );
		} catch ( error ) {
			setReadError( error.message );
		}
	}, [] );

	return (
		<div>
			<p className='small'>Who's here:</p>
			<ul className='small user-list'>
				{readError ? <li>{readError}</li> : null}
				{ userList.map( user => {
					return (
						<li key={user.email} className={user.online ? 'online' : ''}>
							{user.email}
						</li>
					)
				} ) }
			</ul>
		</div>
	);
}

export default UserList;
