import React from 'react';
import { NavLink } from 'react-router-dom';

const navigationItem = (props) => (

	<li>
		<NavLink 
			to={props.link}
			className={ ({isActive}) => isActive 
				? 'nav-link text-secondary' 
				: 'nav-link text-white' }>
			{/* <i className={ props.icon + ' fs-3 d-block text-sm-center' } /> */}
			{ props.children }
		</NavLink>
	</li>
);

export default navigationItem;