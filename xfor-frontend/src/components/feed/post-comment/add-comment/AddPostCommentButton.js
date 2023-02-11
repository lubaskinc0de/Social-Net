import React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';

import { useSelector } from 'react-redux';

export default function AddPostCommentButton() {
    const { addCommentLoading: loading } = useSelector(
        (state) => state.comments
    );

    return (
        <Box sx={{ ml: 1.5 }}>
            {loading ? (
                <CircularProgress sx={{mt: 0.5}} size='1.3rem'></CircularProgress>
            ) : (
                <IconButton type='submit' edge='end'>
                    <SendIcon></SendIcon>
                </IconButton>
            )}
        </Box>
    );
}
