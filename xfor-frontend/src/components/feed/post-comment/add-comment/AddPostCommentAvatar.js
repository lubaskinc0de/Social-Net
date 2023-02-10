import React from 'react';

import Avatar from '@mui/material/Avatar';

import { useSelector } from 'react-redux';

export default function AddPostCommentAvatar() {
    const { first_name, avatar } = useSelector((state) => state.user.userInfo);

    return (
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
    );
}
