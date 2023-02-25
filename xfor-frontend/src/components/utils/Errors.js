import React from 'react';

import { showComponent } from '../../lib';
import { shiftAPIErrors } from '../../store/slices/APIErrorsSlice';
import { useSelector, useDispatch } from 'react-redux';

import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

export default function Errors() {
    const APIErrors = useSelector((state) => state.APIErrors.APIErrors);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(shiftAPIErrors());
    };

    return showComponent(
        <Grid
            item
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Alert
                sx={{
                    maxWidth: 400,
                }}
                onClose={handleClose}
                severity='error'
            >
                {APIErrors[0]}
            </Alert>
        </Grid>,
        APIErrors.length
    );
}
