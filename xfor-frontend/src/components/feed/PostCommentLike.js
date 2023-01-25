import React from 'react';

import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Typography from '@mui/material/Typography';

export default function PostCommentLike({ likesCount, isLiked, disabled, handleLikeClick }) {
    return (
        <div className='flex-align__box' style={{ paddingTop: 'inherit' }}>
            <IconButton
                disabled={disabled}
                onClick={handleLikeClick}
                aria-label='like comment'
            >
                <FavoriteIcon
                    fontSize='small'
                    color={isLiked ? 'error' : undefined}
                />
            </IconButton>
            <Typography
                sx={{
                    lineHeight: 'normal',
                }}
                variant='body2'
            >
                {likesCount}
            </Typography>
        </div>
    );
}
