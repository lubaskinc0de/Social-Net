import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

import { useNavigate } from 'react-router-dom';

export default function NavBarUserIcon(props) {
    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 0 }}>
            {props.loading ? (
                <Skeleton
                    animation='wave'
                    variant='circular'
                    width={40}
                    height={40}
                />
            ) : (
                <Avatar
                    onClick={() => {
                        navigate('/peoples/me/');
                    }}
                    alt={props.alt}
                    src={props.src}
                />
            )}
        </Box>
    );
}
