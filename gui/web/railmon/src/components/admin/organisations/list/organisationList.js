import React from 'react';

const Organisations = (props) => {

    const { organisations, toggle } = props;

    const selectUserItem = (item) => {
        toggle(item);
    }
    
    return (
        <div className='container'>
            <hr className='mb-3' />
            <div className='mb-2'>
                <table className='table table-striped table-hover cursor-pointer'>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Abbr</th>
                            <th scope="col">Role</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organisations && organisations.map((item) => (
                            <tr className='cursor-point' key={item.id} onClick={() => selectUserItem(item)}>
                                <td>{item.name}</td>
                                <td>{item.abbreviation}</td>
                                <td>{item.assetRole}</td>
                                <td>{item.inuse 
                                        ? <span className='badge text-nowrap bg-success'>Enabled</span>
                                        : <span className='badge text-nowrap bg-danger'>Disabled</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            </div>
        </div>
    );
}

export default Organisations;