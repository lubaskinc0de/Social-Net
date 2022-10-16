import React, {useEffect} from 'react';
import {useParams, NavLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {userActivate} from '../../../store/actions/userActions';
import Container from '@mui/material/Container';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ErrorIcon from '@mui/icons-material/Error';
import DownloadingIcon from '@mui/icons-material/Downloading';

export default function Activation() {
    const {uid, token} = useParams();
    const dispatch = useDispatch();
    const {success, rejected, errors} = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(userActivate({uid, token}));
    }, [dispatch, token, uid]);

    const getIcon = () => {
        if (success) {
            return (
                <CheckCircleIcon
                    fontSize='large'
                    color='success'></CheckCircleIcon>
            );
        } else if (rejected) {
            return <ErrorIcon fontSize='large' color='error'></ErrorIcon>;
        }

        return (
            <DownloadingIcon fontSize='large' color='primary'></DownloadingIcon>
        );
    };

    const getText = () => {
        const successText = (
            <NavLink to='/login/'>
                Вы успешно активировали свой аккаунт! Теперь вы можете войти
            </NavLink>
        );
        const loadingText = 'Идет активация..';

        if (success) {
            return successText;
        } else if (rejected) {
            return errors[0];
        }

        return loadingText;
    };

    return (
        <Container
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            maxWidth='ld'>
            <Grid
                justifyContent='center'
                alignItems='center'
                container
                spacing={0}
                direction='column'>
                <Grid item xs={6}>
                    {getIcon()}
                </Grid>
                <Grid item xs={6}>
                    <Typography variant='h7'>{getText()}</Typography>
                </Grid>
            </Grid>
        </Container>
    );
}
