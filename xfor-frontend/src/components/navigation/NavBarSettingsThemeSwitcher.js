import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import useSelectedTheme from '../../hooks/useSelectedTheme';
import { useDispatch } from 'react-redux';
import { setTheme } from '../../store/slices/themeSlice';

export default function NavBarSettingsThemeSwitcher() {
    const selectedTheme = useSelectedTheme();
    const dispatch = useDispatch();

    const iconsProps = {
        mr: 1,
    };

    const handleChange = (e, themeValue) => {
        dispatch(
            setTheme({
                theme: themeValue,
            })
        );
    };

    return (
        <ToggleButtonGroup
            onChange={handleChange}
            value={selectedTheme}
            fullWidth
            exclusive
            color='primary'
        >
            <ToggleButton fullWidth value='light'>
                <LightModeIcon sx={iconsProps}></LightModeIcon>
                Светлая
            </ToggleButton>
            <ToggleButton fullWidth value='dark'>
                <DarkModeOutlinedIcon sx={iconsProps}></DarkModeOutlinedIcon>
                Темная
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
