import React from 'react';
import Header from '../components/ui/header/header';
import Footer from '../components/ui/footer/footer';
import { useSelector } from 'react-redux';

const Layout = (props) => {

    const isAuthenticated = useSelector(state => state.auth.idToken !== null);

    return (
        <React.Fragment>
            <Header isAuthenticated={ isAuthenticated } />
            <main>
                { props.children }
            </main>
            <Footer />
        </React.Fragment>
    );
}

export default Layout;