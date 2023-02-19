import React from 'react';

import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

import { useSelector } from 'react-redux';

export default function AddPostCommentAvatar() {
    const { first_name, avatar } = useSelector((state) => state.user.userInfo);
    const { loading } = useSelector((state) => state.user);

    const avatarStyles = {
        color: 'action.active',
        mr: 1.5,
        width: '36px',
        height: '36px',
    };

    return loading ? (
        <Skeleton sx={avatarStyles} width={40} animation='wave' variant='circular' />
    ) : (
        <Avatar sx={avatarStyles} alt={first_name} src={avatar} />
    );
}
