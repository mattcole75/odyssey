import React, { Suspense, useCallback, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './layout/layout';

import { authCheckState } from './store/actions/index';

const App = () => {

	const dispatch = useDispatch();
	const onTryAutoLogin = useCallback(() => dispatch(authCheckState()), [dispatch]);
	const isAuthenticated = useSelector(state => state.auth.idToken !== null);
	const roles = useSelector(state => state.auth.roles);
    const isAdministrator = roles.includes('administrator', 0);

	useEffect(() => {
		onTryAutoLogin();
	}, [onTryAutoLogin]);

	// the index page
	const Index = React.lazy(() => {
		return import('./pages/index');
	});
	// the login component
	const Login = React.lazy(() => {
		return import('./components/auth/login');
	});
	// the signup component
	const Signup = React.lazy(() => {
		return import('./components/auth/signup');
	});
	// the signup component
	const Logout = React.lazy(() => {
		return import('./components/auth/logout');
	});
	// the account component
	const Account = React.lazy(() => {
		return import('./components/auth/account/account');
	});
	const Users = React.lazy(() => {
		return import('./components/admin/users/users');
	});
	const Organisations = React.lazy(() => {
		return import('./components/admin/organisations/organisations');
	});
	const LocationCategories = React.lazy(() => {
		return import('./components/admin/locationCategories/locationCategories');
	});
	const Assets = React.lazy(() => {
		return import('./components/assets/assets')
	});
	const EditAsset = React.lazy(() => {
		return import('./components/assets/assetForms/editAssetForm');
	});

	const routes = (
		<Routes>
			<Route path='/' element={ <Index /> } />
			<Route path='/login' element={ <Login /> } />
			<Route path='/signup' element={ <Signup /> } />
			<Route path='/logout' element={ <Logout /> } />
			{ isAuthenticated && <Route path='/account' element={ <Account /> } /> }
			{ isAuthenticated && <Route path='/assets' element={ <Assets /> } /> }
			{ isAuthenticated && <Route path='/asset/:id' element={ <EditAsset /> } /> }
			{ isAuthenticated && isAdministrator && <Route path='admin/users' element={ <Users /> } /> }
			{ isAuthenticated && isAdministrator && <Route path='admin/organisations' element={ <Organisations /> } /> }
			{ isAuthenticated && isAdministrator && <Route path='admin/locationcategories' element={ <LocationCategories /> } /> }
			<Route path='*' element={ <Index /> } />
		</Routes>
	);

	return (
		<div>
			<Layout isAuthenticated={ isAuthenticated } isAdministrator={ isAdministrator }>
				<Suspense fallback={<p>Loading...</p>}>{ routes }</Suspense>
			</Layout>
		</div>
	);
}

export default App;
