import React, { useState } from 'react';
import Button from '@mui/material/Button';
import NavBarSettingsFeedFiltersDialog from './NavBarSettingsFeedFiltersDialog';

export default function NavBarSettingsFeedFilters() {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <NavBarSettingsFeedFiltersDialog
                open={open}
                handleClose={handleClose}
            ></NavBarSettingsFeedFiltersDialog>
            <Button onClick={handleOpen} fullWidth variant='contained'>
                Открыть фильтры постов
            </Button>
        </>
    );
}
