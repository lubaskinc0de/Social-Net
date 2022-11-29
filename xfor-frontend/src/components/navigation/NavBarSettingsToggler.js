import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import NavBarSettings from './NavBarSettings';

export default function NavBarSettingsToggler() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton onClick={handleOpen} sx={{ mr: 1 }} color='inherit'>
                <SettingsOutlinedIcon></SettingsOutlinedIcon>
            </IconButton>
            <NavBarSettings
                open={open}
                handleClose={handleClose}
            ></NavBarSettings>
        </>
    );
}
