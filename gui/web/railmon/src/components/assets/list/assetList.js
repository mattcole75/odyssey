import React from 'react';

const Assets = (props) => {

    const { assets } = props;
    
    return (
        <div className='container'>
            <hr className='mb-3' />
            <div className='mb-2'>
                <table className='table table-striped table-hover cursor-pointer'>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Owner</th>
                            <th scope="col">Maintainer</th>
                            <th scope="col">Operational</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets && assets.map((item) => (
                            <tr key={item.id} onClick={() => {}}>
                                <td>{item.name}</td>
                                <td>{item.ownedByRef}</td>
                                <td>{item.maintainedByRef}</td>
                                <td>{item.operational
                                        ? <span className='badge text-nowrap bg-success'>Operational</span>
                                        : <span className='badge text-nowrap bg-danger'>Decommissioned</span>
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

export default Assets;