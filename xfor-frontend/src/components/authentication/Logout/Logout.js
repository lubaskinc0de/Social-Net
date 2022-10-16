import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {userLogout} from '../../../store/actions/userActions';
import {useDispatch} from 'react-redux';

export default function Page404() {
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(userLogout());
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}>
            <Typography variant='h4' gutterBottom>
                Выйти?
            </Typography>
            <Button variant='contained' onClick={handleClick}>
                Выйти
            </Button>
        </Box>
    );
}
