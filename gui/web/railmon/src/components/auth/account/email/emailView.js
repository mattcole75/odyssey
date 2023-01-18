import React from 'react';

const EmailView = (props) => (
    <li className='list-group-item d-flex justify-content-between lh-sm'>
        <div className='text-start'>
            <h6 className='my-0'>Email</h6>
            <small className='text-muted'>{ props.email }</small>
        </div>
        <button className='btn btn-outline-primary' onClick={ props.toggle }>Edit</button>
    </li>
);

export default EmailView;