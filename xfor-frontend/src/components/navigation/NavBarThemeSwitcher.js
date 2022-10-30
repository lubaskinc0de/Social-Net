import React from 'react';
import {useTheme} from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import {useDispatch} from 'react-redux';
import {setTheme} from '../../store/slices/themeSlice';

export default function NavBarThemeSwitcher() {
    const theme = useTheme();
    const dispatch = useDispatch();

    const switchTheme = () => {
        dispatch(
            setTheme({
                theme: theme.palette.mode === 'dark' ? 'light' : 'dark',
            }),
        );
    };

    return (
        <IconButton onClick={switchTheme} sx={{mr: 1}} color='inherit'>
            {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
            ) : (
                <Brightness4Icon />
            )}
        </IconButton>
    );
}
