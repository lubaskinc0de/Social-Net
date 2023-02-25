import React from 'react';

import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export default function ProfileBio({ bio, loading }) {
    return loading ? (
        <Skeleton animation='wave' height={20} width='40%' />
    ) : (
        <Typography variant='body2'>{bio}</Typography>
    );
}
