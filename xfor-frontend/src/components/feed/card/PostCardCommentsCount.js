import React from 'react';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import Typography from '@mui/material/Typography';

export default function PostCardCommentsCount(props) {
    return (
        <div className='flex-align__box'>
            <IconButton
                sx={{ ml: 1 }}
                href={props.href}
                aria-label='comments count'
            >
                <CommentIcon></CommentIcon>
            </IconButton>
            <Typography
                sx={{
                    lineHeight: 'normal',
                }}
                variant='body2'
            >
                {props.commentsCount}
            </Typography>
        </div>
    );
}
