import React, { useState } from 'react';
import Header from '../components/ui/header/header';
import Sidebar from '../components/ui/navigation/sidebar';
import Footer from '../components/ui/footer/footer';
import { useSelector } from 'react-redux';

const Layout = (props) => {

    const isAuthenticated = useSelector(state => state.auth.idToken !== null);
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleShowSidebar = () => {
        setShowSidebar(prevState => !prevState);
    }

    return (
        <React.Fragment>
            <Header isAuthenticated={ isAuthenticated } showSidebar={ showSidebar } toggleShowSidebar={ toggleShowSidebar } />  
            <Sidebar isAuthenticated={ isAuthenticated } showSidebar={ showSidebar } toggleShowSidebar={ toggleShowSidebar } />
            <main>
                { props.children }
            </main>
            <Footer />
        </React.Fragment>
    );
}

export default Layout;