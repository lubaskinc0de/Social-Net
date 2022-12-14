import React from 'react';

import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function PostComment() {
    return (
        <>
            <ListItem alignItems='flex-start'>
                <ListItemAvatar>
                    <Avatar
                        alt='Remy Sharp'
                        src='/static/images/avatar/1.jpg'
                    />
                </ListItemAvatar>
                <ListItemText
                    primary='Ali conors'
                    disableTypography
                    secondary={
                        <>
                            <Typography variant='body2'>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Reiciendis explicabo quos a
                                autem cupiditate omnis velit necessitatibus ab
                                voluptates praesentium molestias odio hic
                                laboriosam repudiandae, quia eaque veniam
                                eligendi ratione.
                            </Typography>
                            <div className='flex-align__box flex-between__box'>
                                <Grid
                                    sx={{ color: 'text.secondary' }}
                                    container
                                    alignItems='center'
                                    spacing={2}
                                >
                                    <Grid item>
                                        <Typography variant='body2'>
                                            8 дней назад
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Link underline='none' variant='body2'>
                                            Ответить
                                        </Link>
                                    </Grid>
                                </Grid>
                                <div className='flex-align__box'>
                                    <IconButton aria-label='like comment'>
                                        <FavoriteIcon fontSize='small' />
                                    </IconButton>
                                    <Typography
                                        sx={{
                                            lineHeight: 'normal',
                                        }}
                                        variant='body2'
                                    >
                                        0
                                    </Typography>
                                </div>
                            </div>
                        </>
                    }
                />
            </ListItem>
            <Divider sx={{ mr: 2 }} variant='inset' component='li' />
        </>
    );
}
