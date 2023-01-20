import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

import { setPostsPriority } from '../../store/slices/feed/postsSlice';

import { useSelector, useDispatch } from 'react-redux';

export default function NavBarSettingsFeedFiltersDialogPriority() {
    const { priority } = useSelector((state) => state.posts.postsFilters);
    const dispatch = useDispatch();

    const handleChangePriority = (event) => {
        dispatch(
            setPostsPriority({
                priority: event.target.value,
            })
        );
    };

    return (
        <>
            <FormLabel
                sx={{
                    mb: 0.5,
                    '&.Mui-focused': {},
                }}
                id='feed_filters_label'
            >
                Приоритет постов
            </FormLabel>
            <RadioGroup
                aria-labelledby='feed_filters_label'
                name='posts_priority'
                value={priority}
                onChange={handleChangePriority}
            >
                <FormControlLabel
                    value='is_interesting'
                    control={<Radio />}
                    label='Сначала интересные'
                />
                <FormControlLabel
                    value='is_popular'
                    control={<Radio />}
                    label='Сначала популярные'
                />
            </RadioGroup>
        </>
    );
}
