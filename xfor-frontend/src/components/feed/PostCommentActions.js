import React from 'react';

import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function PostCommentActions({ timesince, likesCount }) {
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
                    <Link underline='none' variant='body2'>
                        Ответить
                    </Link>
                </Grid>
            </Grid>
            <div className='flex-align__box' style={{ paddingTop: 'inherit' }}>
                <IconButton aria-label='like comment'>
                    <FavoriteIcon fontSize='small' />
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
        </Box>
    );
}
