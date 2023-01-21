import React from 'react';
import NavigationItem from './navigationItem/navigationItem';
import NavigationMenuItem from './navigationMenuItem/navigationMenuItem';

const Navigation = (props) => {

    const { isAuthenticated } = props;

    return (
        <nav>
            <ul className='nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0'>
                <NavigationItem link='/' icon='bi-house-door'>Home</NavigationItem>

				{ isAuthenticated
					?	<NavigationItem link='/assets' icon='bi-share'>Assets</NavigationItem>
					:	null
				}
				

                <div  className='dropdown text-end'>
					<a href='/' className='nav-link text-white dropdown-toggle' id='dropdownUser1' data-bs-toggle='dropdown' aria-expanded='false'>
						<i className='bi-person fs-3 d-block text-sm-center'></i>
						Profile
					</a>
					<ul className='dropdown-menu text-small' aria-labelledby='dropdownUser1'>
						{ isAuthenticated
							?	<NavigationMenuItem link='/account' icon='bi-person'> Account</NavigationMenuItem>
							:	null
						}
						{ isAuthenticated
							?	<li><hr className='dropdown-divider'/></li>
							:	null
						}						
                        { !isAuthenticated
							?	<NavigationMenuItem link='/login' icon='bi-person-check'> Login</NavigationMenuItem>
							:	null
						}
						{ isAuthenticated
							?   <NavigationMenuItem link='/logout' icon='bi-person-x'> Logout</NavigationMenuItem>
							:   null
						}
                        { !isAuthenticated
                            ?   <NavigationMenuItem link='/signup' icon='bi-person-plus'> Sign-up</NavigationMenuItem>
                            :   null
                        }						
					</ul>
				</div>
            </ul>
        </nav>
    )
}

export default Navigation;