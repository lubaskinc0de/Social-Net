/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './authentication.css';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Buttons from './FormComponents/FormButtons';
import {showComponent, shiftWithoutMutation} from '../../lib/authentication';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

export default function Form(props) {
    const APIErrors = props.APIErrors;

    const handleClose = () => {
        props.setAPIErrors(shiftWithoutMutation(APIErrors));
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
                    !APIErrors.length && !props.message,
                )}

                {showComponent(
                    <Grid item xs={12}>
                        <Alert onClose={handleClose} severity='error'>
                            {props.APIErrors[0]}
                        </Alert>
                    </Grid>,
                    APIErrors.length,
                )}

                {showComponent(
                    <Grid item xs={12}>
                        <Alert onClose={handleCloseMessage} severity='info'>
                            {props.message}
                        </Alert>
                    </Grid>,
                    props.message,
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
