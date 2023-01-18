import React from 'react';
import Navigation from '../navigation/navigation';

const Header = (props) => {

    return (
        <header>
            <div className='px-3 py-2 bg-dark'>
                <div className='container'>
                    <div className='d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start border-bottom'>
                        <a href='/' className='d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none'>
                            <i className='bi-robot fs-1 me-4' />
                            <p className='h1 mb-0'>RailMon</p>
                        </a>

                        <Navigation isAuthenticated={ props.isAuthenticated }/>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;