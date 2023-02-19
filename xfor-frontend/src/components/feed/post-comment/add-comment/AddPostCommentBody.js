import React from 'react';

import TextField from '@mui/material/TextField';

export default function AddPostCommentBody({
    handleChange,
    value,
    name,
    id,
    isError,
    helperText,
}) {
    return (
        <TextField
            id={id}
            label='Что вы думаете об этом посте?'
            fullWidth
            value={value}
            name={name}
            onChange={handleChange}
            multiline
            error={isError}
            helperText={helperText}
            FormHelperTextProps={{ sx: { ml: 0 } }}
        />
    );
}
