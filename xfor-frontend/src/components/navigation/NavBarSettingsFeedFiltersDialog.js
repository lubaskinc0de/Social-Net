import React from 'react';
import FormDialog from '../utils/FormDialog';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';

import NavBarSettingsFeedFiltersDialogPriority from './NavBarSettingsFeedFiltersDialogPriority';
import NavBarSettingsFeedFiltersDialogOrdering from './NavBarSettingsFeedFiltersDialogOrdering';
import NavBarSettingsFeedFiltersDialogCategory from './NavBarSettingsFeedFiltersDialogCategory';

export default function NavBarSettingsFeedFiltersDialog(props) {
    return (
        <FormDialog open={props.open} handleClose={props.handleClose}>
            <Stack spacing={1} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <div>
                    <FormControl>
                        <NavBarSettingsFeedFiltersDialogPriority></NavBarSettingsFeedFiltersDialogPriority>
                    </FormControl>
                </div>
                <div>
                    <FormControl fullWidth>
                        <NavBarSettingsFeedFiltersDialogOrdering></NavBarSettingsFeedFiltersDialogOrdering>
                    </FormControl>
                </div>
                <div>
                    <FormControl fullWidth>
                        <NavBarSettingsFeedFiltersDialogCategory></NavBarSettingsFeedFiltersDialogCategory>
                    </FormControl>
                </div>
            </Stack>
        </FormDialog>
    );
}
