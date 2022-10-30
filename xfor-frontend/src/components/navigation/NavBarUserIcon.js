import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

export default function NavBarUserIcon(props) {
    return (
        <Box sx={{flexGrow: 0}}>
            {props.loading ? (
                <Skeleton
                    animation='wave'
                    variant='circular'
                    width={40}
                    height={40}
                />
            ) : (
                <Avatar alt={props.alt} src={props.src} />
            )}
        </Box>
    );
}
