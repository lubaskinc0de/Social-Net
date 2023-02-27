import React from 'react';

import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export default function ProfileFullName({ name, surname, loading }) {
    return loading ? (
        <Skeleton animation='wave' height={25} width='60%' />
    ) : (
        <Typography variant='h6'>
            {name} {surname}
        </Typography>
    );
}
