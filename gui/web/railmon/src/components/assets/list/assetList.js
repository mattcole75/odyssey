import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../../shared/utility';

const Assets = (props) => {

    const { assets } = props;
    const roles = useSelector(state => state.auth.roles);
    
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
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets && assets.map((item) => (
                            <tr key={item.id} >
                                <td><div className='col-truncate'>{item.name}</div></td>
                                <td className='item-name'>{item.owner}</td>
                                <td className='item-code'>{item.ownerAbbr}</td>
                                <td className='item-name'>{item.maintainer}</td>
                                <td className='item-code'>{item.maintainerAbbr}</td>
                                <td ><div className='col-truncate'>{capitalizeFirstLetter(item.status)}</div></td>
                                <td className='ps-3 pe-3'>
                    <div className='dropdown'>
                        <div className='' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                            <span className='bi-three-dots-vertical fs-7' />
                        </div>
                        <ul className='dropdown-menu fs-7'>
                            <li><Link className='dropdown-item' to={`/asset/${ item.id }`} >Open</Link></li>
                            { roles.includes('administrator')
                                ?   <li><button type='button' className='dropdown-item' onClick={ () => {} }>Delete</button></li>
                                :   null
                            }
                           
                        </ul>
                    </div>
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