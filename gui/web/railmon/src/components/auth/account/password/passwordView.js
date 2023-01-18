import React from 'react';

const PasswordView = (props) => (
    <li className='list-group-item d-flex justify-content-between lh-sm'>
        <div className='text-start'>
            <h6 className='my-0'>Password</h6>
            <small className='text-muted form-auth-password'>1234567890</small>
        </div>
        <button className='btn btn-outline-primary' onClick={ props.toggle }>Edit</button>
    </li>
);

export default PasswordView;