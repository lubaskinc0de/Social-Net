import React from 'react';

import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export default function AddPostCommentBody() {
    return (
        <FormControl variant='outlined' fullWidth>
            <InputLabel htmlFor='comment-body-input'>
                Что вы думаете об этом посте?
            </InputLabel>
            <OutlinedInput
                id='comment-body-input'
                label='Что вы думаете об этом посте?'
                fullWidth
                endAdornment={
                    <InputAdornment position='end'>
                        <IconButton edge='end'>
                            <SendIcon></SendIcon>
                        </IconButton>
                    </InputAdornment>
                }
                multiline
            />
        </FormControl>
    );
}
