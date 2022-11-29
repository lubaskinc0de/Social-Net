import React from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Typography from '@mui/material/Typography';

export default function PostCardLike(props) {
    return (
        <div className='flex-align__box'>
            <IconButton
                disabled={props.disabled}
                onClick={props.handleLikeClick}
                aria-label='like'
            >
                <FavoriteIcon color={props.isLiked ? 'error' : undefined} />
            </IconButton>
            <Typography
                sx={{
                    lineHeight: 'normal',
                }}
                variant='body2'
            >
                {props.likesCount}
            </Typography>
        </div>
    );
}
