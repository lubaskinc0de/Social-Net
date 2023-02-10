import React from 'react';

import Box from '@mui/material/Box';

import AddPostCommentAvatar from './AddPostCommentAvatar';
import AddPostCommentBody from './AddPostCommentBody';

export default function AddPostComment() {
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
                <AddPostCommentAvatar></AddPostCommentAvatar>
                <AddPostCommentBody></AddPostCommentBody>
            </Box>
        </Box>
    );
}
