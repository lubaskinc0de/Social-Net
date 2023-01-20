import React from 'react';

import ListItemAvatar from '@mui/material/ListItemAvatar';

import Avatar from '@mui/material/Avatar';

export default function PostCommentAvatar({ alt, src }) {
    return (
        <ListItemAvatar>
            <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
        </ListItemAvatar>
    );
}
