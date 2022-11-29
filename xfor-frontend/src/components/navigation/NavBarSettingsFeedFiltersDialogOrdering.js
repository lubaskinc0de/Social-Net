import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';

export default function NavBarSettingsFeedFiltersDialogOrdering({
    ordering,
    handleChange,
}) {
    return (
        <>
            <InputLabel htmlFor='ordering'>Упорядочить по</InputLabel>
            <Select
                native
                value={ordering}
                onChange={handleChange}
                input={<OutlinedInput label='Ordering' id='ordering' />}
            >
                <option value='-created_at'>Сначала новые</option>
                <option value='created_at'>Сначала старые</option>
            </Select>
        </>
    );
}
