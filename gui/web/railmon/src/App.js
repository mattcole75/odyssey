import React, { Suspense, useCallback, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './layout/layout';

import { authCheckState } from './store/actions/index';

const App = () => {

	const dispatch = useDispatch();
	const onTryAutoLogin = useCallback(() => dispatch(authCheckState()), [dispatch]);
	const isAuthenticated = useSelector(state => state.auth.idToken !== null);

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

	const routes = (
		<Routes>
			<Route path='/' element={ <Index /> } />
			<Route path='/login' element={ <Login /> } />
			<Route path='/signup' element={ <Signup /> } />
			<Route path='/logout' element={ <Logout /> } />
			{ isAuthenticated && <Route path='/account' element={ <Account /> } /> }
		</Routes>
	);

	return (
		<div>
			<Layout>
				<Suspense fallback={<p>Loading...</p>}>{ routes }</Suspense>
			</Layout>
		</div>
	);
}

export default App;
