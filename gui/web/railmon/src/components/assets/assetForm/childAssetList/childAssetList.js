import React from 'react';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../../../shared/utility';

const ChildAssets = (props) => {

    const { assets } = props;
    const navigate = useNavigate();
    
    return (
        <div className='container'>
            <hr className='mb-3' />
            <div className='mb-2'>
                { assets.length > 0
                    ?   <table className='table table-striped table-hover cursor-pointer'>
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets && assets.map((item) => (
                                    <tr key={item.id} onClick={ () => { navigate(`/asset/${ item.id }`) } }>
                                        <td>{item.name}</td>
                                        <td>{capitalizeFirstLetter(item.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    :   <div className='alert alert-warning text-sm-center' role='alert'>There are no child assets registered</div>
                }
                
            </div>
        </div>
    );
}

export default ChildAssets;