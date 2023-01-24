import React, { useState } from 'react';
import Header from '../components/ui/header/header';
import Sidebar from '../components/ui/navigation/sidebar';
import Footer from '../components/ui/footer/footer';

const Layout = (props) => {

    const { isAuthenticated, isAdministrator } = props;
    
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleShowSidebar = () => {
        setShowSidebar(prevState => !prevState);
    }

    return (
        <React.Fragment>
            <Header isAuthenticated={ isAuthenticated } isAdministrator={ isAdministrator } showSidebar={ showSidebar } toggleShowSidebar={ toggleShowSidebar } />  
            <Sidebar isAuthenticated={ isAuthenticated } isAdministrator={ isAdministrator } showSidebar={ showSidebar } toggleShowSidebar={ toggleShowSidebar } />
            <main>
                { props.children }
            </main>
            <Footer />
        </React.Fragment>
    );
}

export default Layout;