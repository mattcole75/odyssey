import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = (props) => {

    const { isAuthenticated, isAdministrator, showSidebar, toggleShowSidebar } = props;

    const navStyle = ['col-md-3', 'col-lg-2', 'sidebar', 'bg-dark', 'bg-opacity-95']

    if(!showSidebar) {
        navStyle.push('collapse')
    }

    return (
        <div className='container'>
            <nav id='sidebarMenu' className={navStyle.join(' ')}>
                <div className='position-sticky pt-3 sidebar-sticky'>
                    <ul className='nav nav-pills flex-column mb-auto'>
                        <li className='nav-item'>
                            <NavLink to='/' className='nav-link text-white' onClick={ toggleShowSidebar }><i className='bi-house-door' />  Home</NavLink>
                        </li>
                        
                        { isAuthenticated
                            ?   <li className='nav-item'>
                                    <NavLink to='/assets' className='nav-link text-white' onClick={ toggleShowSidebar }><i className='bi-share' />  Assets</NavLink>
                                </li>
                            : null
                        }
                        
                        { isAuthenticated
                            ?   <div className='mx-2'>
                                    <hr />
                                </div>
                            : null
                        }

                        { isAuthenticated
                            ?   <li className='nav-item'>
                                    <NavLink to='/account' className='nav-link text-white' onClick={ toggleShowSidebar }><i className='bi-person' />  Account</NavLink>
                                </li>
                            : null
                        }
                        { isAuthenticated
                            ?   <li className='nav-item'>
                                    <NavLink to='/logout' className='nav-link text-white' onClick={ toggleShowSidebar }><i className='bi-person-x' />  Logout</NavLink>
                                </li>
                            : null
                        }
                        { !isAuthenticated
                            ?   <li className='nav-item'>
                                    <NavLink to='/login' className='nav-link text-white' onClick={ toggleShowSidebar }><i className='bi-person-check' />  Login</NavLink>
                                </li>
                            :   null
                        }
                        { !isAuthenticated
                            ?   <li className='nav-item'>
                                    <NavLink to='/signup' className='nav-link text-white' onClick={ toggleShowSidebar }><i className='bi-person-plus' />  Sign Up</NavLink>
                                </li>
                            :   null
                        }

                        {/* admin */}
                        { isAuthenticated && isAdministrator
                            ?   <div className='mx-2'>
                                    <hr />
                                </div>
                            : null
                        }
                        { isAuthenticated && isAdministrator
                            ?   <li className='nav-item'>
                                    <NavLink to='/admin/users' className='nav-link text-white' onClick={ toggleShowSidebar }><i className='bi-people' />  Users</NavLink>
                                </li>
                            : null
                        }
                        { isAuthenticated && isAdministrator
                            ?   <li className='nav-item'>
                                    <NavLink to='/admin/organisations' className='nav-link text-white' onClick={ toggleShowSidebar }><i className='bi-building' />  Organisations</NavLink>
                                </li>
                            : null
                        }
                        { isAuthenticated && isAdministrator
                            ?   <li className='nav-item'>
                                    <NavLink to='/admin/locationcategories' className='nav-link text-white' onClick={ toggleShowSidebar }><i className='bi-bookmarks' />  Location Categories</NavLink>
                                </li>
                            : null
                        }
                    </ul>
                </div>
            </nav>
        </div>

        // <div className='container'>

        // <div className='d-flex flex-column flex-shrink-0 p-3 text-bg-dark' style={{width: 280}}>

        //     <a href='/' className='d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none'>
        //         <i className='bi-robot fs-1 me-4' />
        //         <p className='h1 mb-0'>RailMon</p>
        //     </a>
            
        //     <ul className='nav nav-pills flex-column mb-auto'>
        //         <li className='nav-item'>
        //             <a href='/' className='nav-link active' aria-current='page'>
        //                 <svg className='bi pe-none me-2' width='16' height='16'><use xlinkHref='#home'></use></svg>
        //                 Home
        //             </a>
        //         </li>
        //         <li>
        //             <a href='/' className='nav-link text-white'>
        //                 <svg className='bi pe-none me-2' width='16' height='16'><use xlinkHref='#speedometer2'></use></svg>
        //                 Dashboard
        //             </a>
        //         </li>
        //         <li>
        //             <a href='/' className='nav-link text-white'>
        //                 <svg className='bi pe-none me-2' width='16' height='16'><use xlinkHref='#table'></use></svg>
        //                 Orders
        //             </a>
        //         </li>
        //         <li>
        //             <a href='/' className='nav-link text-white'>
        //                 <svg className='bi pe-none me-2' width='16' height='16'><use xlinkHref='#grid'></use></svg>
        //                 Products
        //             </a>
        //         </li>
        //         <li>
        //             <a href='/' className='nav-link text-white'>
        //                 <svg className='bi pe-none me-2' width='16' height='16'><use xlinkHref='#people-circle'></use></svg>
        //                 Customers
        //             </a>
        //         </li>
        //     </ul>
        //     <hr />
        //     <div className='dropdown'>
        //         <a href='/' className='d-flex align-items-center text-white text-decoration-none dropdown-toggle' data-bs-toggle='dropdown' aria-expanded='false'>
        //             <img src='https://github.com/mdo.png' alt='' width={32} height={32} className='rounded-circle me-2' />
        //             <strong>mdo</strong>
        //     </a>
        //     <ul className='dropdown-menu dropdown-menu-dark text-small shadow'>
        //         <li><a className='dropdown-item' href='/'>New project...</a></li>
        //         <li><a className='dropdown-item' href='/'>Settings</a></li>
        //         <li><a className='dropdown-item' href='/'>Profile</a></li>
        //         <li><hr className='dropdown-divider' /></li>
        //         <li><a className='dropdown-item' href='/'>Sign out</a></li>
        //     </ul>
        //     </div>
        // </div>


            // <div className='flex-shrink-0 p-3' style={{width: 280 }}>
            //     <a href='/' className='d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom'>
            //         <svg className='bi pe-none me-2' width='30' height='24'></svg>
            //         <span className='fs-5 fw-semibold'>Collapsible</span>
            //     </a>

            //     <ul className='list-unstyled ps-0'>
            //         <li className='mb-1'>
            //             <button className='btn btn-toggle d-inline-flex align-items-center rounded border-0' data-bs-toggle='collapse' data-bs-target='#home-collapse' aria-expanded='true'>
            //                 Home
            //             </button>
                        
            //             <div className='collapse show' id='home-collapse'>
            //                 <ul className='btn-toggle-nav list-unstyled fw-normal pb-1 small'>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Overview</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Updates</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Reports</a></li>
            //                 </ul>
            //             </div>
            //         </li>
            //         <li className='mb-1'>
            //             <button className='btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed' data-bs-toggle='collapse' data-bs-target='#dashboard-collapse' aria-expanded='false'>
            //                 Dashboard
            //             </button>
            //             <div className='collapse' id='dashboard-collapse'>
            //                 <ul className='btn-toggle-nav list-unstyled fw-normal pb-1 small'>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Overview</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Weekly</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Monthly</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Annually</a></li>
            //                 </ul>
            //             </div>
            //         </li>
            //         <li className='mb-1'>
            //             <button className='btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed' data-bs-toggle='collapse' data-bs-target='#orders-collapse' aria-expanded='false'>
            //                 Orders
            //             </button>
            //             <div className='collapse' id='orders-collapse'>
            //                 <ul className='btn-toggle-nav list-unstyled fw-normal pb-1 small'>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Processed</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Shipped</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>New</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Returned</a></li>
            //                 </ul>
            //             </div>
            //         </li>
            //         <li className='border-top my-3'></li>
            //         <li className='mb-1'>
            //             <button className='btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed' data-bs-toggle='collapse' data-bs-target='#account-collapse' aria-expanded='false'>
            //                 Account
            //             </button>
            //             <div className='collapse' id='account-collapse'>
            //                 <ul className='btn-toggle-nav list-unstyled fw-normal pb-1 small'>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>New...</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Profile</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Settings</a></li>
            //                     <li><a href='/' className='link-dark d-inline-flex text-decoration-none rounded'>Sign out</a></li>
            //                 </ul>
            //             </div>
            //         </li>
            //     </ul>
            // </div>
        // </div>

    )
}

export default Sidebar;