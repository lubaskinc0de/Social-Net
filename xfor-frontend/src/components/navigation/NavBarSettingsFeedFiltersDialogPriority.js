import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

export default function NavBarSettingsFeedFiltersDialogPriority({
    priority,
    handleChange,
}) {
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
                onChange={handleChange}
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
