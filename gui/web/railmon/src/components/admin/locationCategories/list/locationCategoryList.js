import React from 'react';

const locationCategories = (props) => {

    const { locationCategories, toggle } = props;

    const selectLocationCategoryItem = (item) => {
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
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locationCategories && locationCategories.map((item) => (
                            <tr key={item.id} onClick={() => selectLocationCategoryItem(item)}>
                                <td>{item.name}</td>
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

export default locationCategories;