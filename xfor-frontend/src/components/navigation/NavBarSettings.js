import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import NavBarSettingsThemeSwitcher from './NavBarSettingsThemeSwitcher';
import NavBarSettingsFeedFilters from './NavBarSettingsFeedFilters';
import NavBarSettingsSection from './NavBarSettingsSection';

export default function NavBarSettings(props) {
    return (
        <Drawer
            variant='temporary'
            anchor='right'
            open={props.open}
            onClose={props.handleClose}
        >
            <Box
                display='flex'
                alignItems='center'
                padding={2}
                justifyContent='space-between'
            >
                <Typography variant='body1'>Настройки</Typography>
                <IconButton onClick={props.handleClose}>
                    <CloseIcon></CloseIcon>
                </IconButton>
            </Box>
            <Divider></Divider>
            <Box px={2}>
                <NavBarSettingsSection title='Тема'>
                    <NavBarSettingsThemeSwitcher></NavBarSettingsThemeSwitcher>
                </NavBarSettingsSection>
                <NavBarSettingsSection title='Лента'>
                    <NavBarSettingsFeedFilters></NavBarSettingsFeedFilters>
                </NavBarSettingsSection>
            </Box>
        </Drawer>
    );
}
