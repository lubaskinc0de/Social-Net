import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function NavBarSettingsFeedFiltersDialogOrdering({
    ordering,
    handleChange,
}) {
    return (
        <>
            <InputLabel id='orderingSelectLabel'>Упорядочить по</InputLabel>
            <Select
                value={ordering}
                labelId='orderingSelectLabel'
                input={<OutlinedInput label='Упорядочить по' />}
                onChange={handleChange}
            >
                <MenuItem value='-created_at'>Сначала новые</MenuItem>
                <MenuItem value='created_at'>Сначала старые</MenuItem>
            </Select>
        </>
    );
}
