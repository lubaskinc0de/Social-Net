import React from 'react';

import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import PostCommentActions from './PostCommentActions';

export default function PostCommentText({
    username,
    text,
    timesince,
    likesCount,
}) {
    return (
        <ListItemText
            primary={username}
            sx={{mb: 0}}
            disableTypography
            secondary={
                <>
                    <Typography variant='body2'>{text}</Typography>
                    <PostCommentActions
                        timesince={timesince}
                        likesCount={likesCount}
                    ></PostCommentActions>
                </>
            }
        />
    );
}
