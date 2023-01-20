import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';

import { useSelector, useDispatch } from 'react-redux';
import { setPostsOrdering } from '../../store/slices/feed/postsSlice';

export default function NavBarSettingsFeedFiltersDialogOrdering() {
    const dispatch = useDispatch();

    const { ordering } = useSelector((state) => state.posts.postsFilters);

    const handleChangeOrdering = (event) => {
        dispatch(
            setPostsOrdering({
                ordering: event.target.value,
            })
        );
    };

    return (
        <>
            <InputLabel id='orderingSelectLabel'>Упорядочить по</InputLabel>
            <Select
                value={ordering || ''}
                labelId='orderingSelectLabel'
                input={<OutlinedInput label='Упорядочить по' />}
                onChange={handleChangeOrdering}
            >
                <MenuItem value='-created_at'>Сначала новые</MenuItem>
                <MenuItem value='created_at'>Сначала старые</MenuItem>
            </Select>
        </>
    );
}
