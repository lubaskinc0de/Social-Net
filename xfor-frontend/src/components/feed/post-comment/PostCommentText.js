import React from 'react';

import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

export default function PostCommentText({ username, text, actions }) {
    return (
        <ListItemText
            primary={username}
            sx={{ mb: 0 }}
            disableTypography
            secondary={
                <>
                    <Typography variant='body2'>{text}</Typography>
                    {actions}
                </>
            }
        />
    );
}
