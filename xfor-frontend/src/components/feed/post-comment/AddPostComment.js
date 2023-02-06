import React from 'react';

import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { useSelector } from 'react-redux';

export default function AddPostComment() {
    const { first_name, avatar } = useSelector((state) => state.user.userInfo);

    return (
        <Box
            component='form'
            display='flex'
            px={3}
            py={1}
            noValidate
            autoComplete='off'
            flexDirection='column'
        >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Avatar
                    sx={{
                        color: 'action.active',
                        mr: 1.5,
                        width: '36px',
                        height: '36px',
                    }}
                    alt={first_name}
                    src={avatar}
                />
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
            </Box>
        </Box>
    );
}
