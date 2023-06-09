import React from 'react';

const DeleteAssetForm = (props) => {

    const { id, deleteAsset, toggle } = props;

    return (
        <div className='form-admin'>
            <h1 className='h3 mb-3 fw-normal text-start'>Delete Asset</h1>
            <form>
                <div className='alert alert-danger' role='alert'>
                    This action will delete this asset and any associated descendant assets. 
                </div>
                <div className='alert alert-info' role='alert'>
                    If there are associated descendant assets you want to keep please reallocate those assets before deleting. 
                </div>

                <div className='form-floating mb-3 mt-3'>
                    <button
                        className='w-100 btn btn-primary'
                        type='button'
                        onClick={ deleteAsset }>Delete</button>
                </div>

                <div className='form-floating mb-3'>
                    <button
                        className='w-100 btn btn-secondary'
                        type='button'
                        onClick={ toggle }>Close</button>
                </div>
            </form>
        </div>
    );
}

export default DeleteAssetForm;