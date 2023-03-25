import React from 'react';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../../shared/utility';

const Assets = (props) => {

    const { assets } = props;
    const navigate = useNavigate();
    
    return (
        <div className='container'>
            <hr className='mb-3' />
            <div className='mb-2'>
                <table className='table table-striped table-hover cursor-pointer'>
                    <thead>
                        <tr className='fs-5'>
                            <th scope="col">Name</th>
                            <th scope="col">Owner</th>
                            <th scope="col">Maintainer</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets && assets.map((item) => (
                            <tr className='cursor-point' key={item.id} onClick={ () => { navigate(`/asset/${ item.id }`) } }>
                                <td>{item.name}</td>
                                <td>{item.ownedByRef}</td>
                                <td>{item.maintainedByRef}</td>
                                <td>{capitalizeFirstLetter(item.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            </div>
        </div>
    );
}

export default Assets;