import React from 'react';
import Navigation from '../navigation/navigation';
import { Link } from 'react-router-dom';

const Header = (props) => {

    const { isAuthenticated, showSidebar, toggleShowSidebar } = props;   

    return (
        <div className='container'>
            <header className='bg-dark navbar sticky-top flex-md-nowrap px-3 py-2 border-bottom'>
                <div className='w-100 d-flex align-items-center justify-content-between navbar-brand col-md-3 col-lg-2 fs-6'>                    
                    <button 
                        className='navbar-toggler d-md-none collapsed'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#sidebarMenu'
                        aria-controls='sidebarMenu'
                        aria-expanded={showSidebar}
                        aria-label='Toggle navigation'
                        onClick={toggleShowSidebar}
                    >
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <Link to='/' className='d-flex align-items-center navbar-brand col-md-3 col-lg-2 px-2'>
                        <i className='bi-robot fs-1 me-4' />
                        <p className='h1 mb-0'>RailMon</p>
                    </Link>
                    <div className='headerNavigation'>
                        <Navigation isAuthenticated={ isAuthenticated }/>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;