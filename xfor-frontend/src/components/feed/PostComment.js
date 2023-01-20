import React from 'react';

import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';

import PostCommentText from './PostCommentText';
import PostCommentAvatar from './PostCommentAvatar';

export default function PostComment({
    username,
    text,
    timesince,
    likesCount,
    avatarAlt,
    avatarSrc,
}) {
    return (
        <>
            <ListItem alignItems='flex-start' sx={{ pb: 0 }}>
                <PostCommentAvatar
                    alt={avatarAlt}
                    src={avatarSrc}
                ></PostCommentAvatar>
                <PostCommentText
                    username={username}
                    text={text}
                    timesince={timesince}
                    likesCount={likesCount}
                ></PostCommentText>
            </ListItem>
            <Divider sx={{ mr: 2 }} variant='inset' component='li' />
        </>
    );
}
