import React from 'react';

import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import PostCommentLike from './PostCommentLike';

export default function PostCommentActions({
    timesince,
    likesCount,
    isLiked,
    handleLikeClick,
    handleReplyClick,
    isLikeDisabled,
}) {
    return (
        <Box
            sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                display: 'flex',
            }}
        >
            <Grid
                sx={{
                    color: 'text.secondary',
                    pt: 'inherit',
                }}
                container
                alignItems='center'
                spacing={2}
            >
                <Grid item>
                    <Typography variant='body2'>{timesince}</Typography>
                </Grid>
                <Grid item>
                    <Link onClick={handleReplyClick} underline='none' variant='body2'>
                        Ответить
                    </Link>
                </Grid>
            </Grid>
            <PostCommentLike
                disabled={isLikeDisabled}
                isLiked={isLiked}
                handleLikeClick={handleLikeClick}
                likesCount={likesCount}
            ></PostCommentLike>
        </Box>
    );
}
