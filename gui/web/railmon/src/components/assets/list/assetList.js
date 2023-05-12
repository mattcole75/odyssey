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
                            <th className='col-truncate item-name' scope="col">Owner</th>
                            <th className='col-truncate item-code' scope="col">Owner</th>
                            <th className='col-truncate item-name' scope="col">Maintainer</th>
                            <th className='col-truncate item-code' scope="col">Maint</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets && assets.map((item) => (
                            <tr className='cursor-point' key={item.id} onClick={ () => { navigate(`/asset/${ item.id }`) } }>
                                <td><div className='col-truncate'>{item.name}</div></td>
                                <td className='item-name'>{item.owner}</td>
                                <td className='item-code'>{item.ownerAbbr}</td>
                                <td className='item-name'>{item.maintainer}</td>
                                <td className='item-code'>{item.maintainerAbbr}</td>
                                <td ><div className='col-truncate'>{capitalizeFirstLetter(item.status)}</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Assets;