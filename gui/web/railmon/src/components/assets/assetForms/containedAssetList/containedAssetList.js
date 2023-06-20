import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../../../shared/utility';

const ContainedAssets = (props) => {

    const { assets, toggle } = props;
    const roles = useSelector(state => state.auth.roles);
    
    return (
        <div className='container border rounded'>
            {/* <hr className='mb-3' /> */}
            <div className='mb-2'>
                { assets.length > 0
                    ?   <table className='table table-striped table-hover'>
                            <thead>
                                <tr className='fs-5'>
                                    <th scope="col">Name</th>
                                    <th scope="col">Location Type</th>
                                    <th scope="col">Status</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets && assets.map((item) => (
                                    <tr key={item.id} >
                                        <td>{ capitalizeFirstLetter(item.name) }</td>
                                        <td>{ item.locationType ? capitalizeFirstLetter(item.locationType) : null }</td>
                                        <td>{ capitalizeFirstLetter(item.status) }</td>
                                        <td className='ps-3 pe-3'>
                                            <div className='dropdown'>
                                                <div className='' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                                                    <span className='bi-three-dots-vertical fs-7' />
                                                </div>
                                                <ul className='dropdown-menu fs-7'>
                                                    <li><Link className='dropdown-item' to={`/asset/${ item.id }`} >Open</Link></li>
                                                    { roles.includes('administrator')
                                                        ?   <li><button type='button' className='dropdown-item' onClick={ () => { toggle(item.id) } }>Delete</button></li>
                                                        :   null
                                                    }
                                                
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    :   <div className='mt-3 alert alert-warning text-sm-center' role='alert'>There are no child assets registered</div>
                }
                
            </div>
        </div>
    );
}

export default ContainedAssets;