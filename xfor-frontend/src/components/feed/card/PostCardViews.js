import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

export default function PostCardViews(props) {
    return (
        <div className='flex-align__box'>
            <Typography
                sx={{
                    lineHeight: 'normal',
                }}
                variant='body2'
            >
                {props.viewsCount}
            </Typography>
            <IconButton>
                <VisibilityIcon fontSize='small' />
            </IconButton>
        </div>
    );
}
