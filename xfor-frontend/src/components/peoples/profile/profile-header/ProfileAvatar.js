import React from 'react';

import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

export default function ProfileAvatar({ alt, src, loading }) {
    return loading ? (
        <Skeleton
            animation='wave'
            variant='circular'
            width={100}
            height={100}
            sx={{
                flexShrink: 0,
            }}
        />
    ) : (
        <Avatar alt={alt} sx={{ width: 100, height: 100 }} src={src}></Avatar>
    );
}
