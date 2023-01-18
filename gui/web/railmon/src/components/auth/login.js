import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { hashPassword } from '../../shared/utility';
import { login } from '../../store/actions/index';

import Backdrop from '../ui/backdrop/backdrop';
import Spinner from '../ui/spinner/spinner';


const Login = () => {

    const dispatch = useDispatch();

    const { idToken, loading, error, redirectPath } = useSelector(state => state.auth);
    const isAuthenticated = idToken !== null;

    const onLogin = useCallback((authData, identifier) => dispatch(login(authData, identifier)), [dispatch]);
    const { register, handleSubmit, getValues } = useForm({ mode: 'onChange' });

    const loginHandler = useCallback((data) => {
        const hash = async () => {
            await hashPassword(getValues().password)
                .then(value => {
                    onLogin({ ...data, password: value }, 'LOGIN');
                })
            }
            hash();
    }, [getValues, onLogin]);

    let spinner = null;
    if(loading)
        spinner = <Spinner />

    return (
        <div className='form-auth'>
            { isAuthenticated ? <Navigate to={ redirectPath } /> : null }
            <Backdrop show={ loading } />
            { spinner }
            { error &&
                <div className='alert alert-danger' role='alert'>
                    { error }
                </div>
            }
            <form className='was-validated' onSubmit={ handleSubmit(loginHandler) }>
                <div className='text-center'>
                    <i className='bi-person-check form-auth-icon'></i>
                    <h1 className='h3 mb-3 fw-normal'>Log In</h1>
                </div>
                <div className='form-floating'>
                    <input type='email' className='form-control form-auth-ele-top' id='email' placeholder='name@example.com' autoComplete='off' required
                    { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) }
                    />
                    <label htmlFor='email'>Email Address</label>
                </div>
                <div className='form-floating mb-3'>
                    <input type='password' className='form-control form-auth-ele-bot form-auth-password' id='password' placeholder='Password' autoComplete='off' required
                    { ...register('password', { required: true, minLength: 6, maxLength: 32 }) }
                    />
                    <label htmlFor='password'>Password</label>
                </div>
                <button className='w-100 btn btn-lg btn-primary' type='submit'>Log In</button>
            </form>
        </div>
    );
}

export default Login;