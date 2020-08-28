import React from 'react';

const Layout = ( props ) => {
	return (
		<main className={`main ${props.page}`}>
			<section className='main__wrapper'>
				{props.children}
			</section>
		</main>
	);
};

export default Layout;