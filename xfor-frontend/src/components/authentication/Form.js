import React from 'react';
import './authentication.css';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Buttons from './FormComponents/FormButtons';
import {showComponent} from '../../lib/authentication';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import {useSelector, useDispatch} from 'react-redux';
import {shiftAPIErrors} from '../../store/slices/authentication/APIErrorsSlice';

export default function Form(props) {
    const APIErrors = useSelector((state) => state.APIErrors.APIErrors);
    const message = props.message
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(shiftAPIErrors());
    };

    const handleCloseMessage = () => {
        props.setMessage('');
    };

    return (
        <Container
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            component='main'
            maxWidth='xs'>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                }}>
                {showComponent(
                    <Typography variant='h5'>{props.title}</Typography>,
                    !APIErrors.length && !message,
                )}

                {showComponent(
                    <Grid item xs={12}>
                        <Alert onClose={handleClose} severity='error'>
                            {APIErrors[0]}
                        </Alert>
                    </Grid>,
                    APIErrors.length && !message,
                )}

                {showComponent(
                    <Grid item xs={12}>
                        <Alert onClose={handleCloseMessage} severity='info'>
                            {message}
                        </Alert>
                    </Grid>,
                    message,
                )}

                <Box
                    component='form'
                    noValidate
                    onSubmit={props.handleSubmit}
                    sx={{mt: 3, width: '100%'}}>
                    <Stack spacing={2}>{props.fields}</Stack>
                    <Buttons
                        handleSubmit={props.handleSubmit}
                        setShowErrors={props.setShowErrors}
                        {...props.buttons}></Buttons>
                </Box>
            </Box>
        </Container>
    );
}
