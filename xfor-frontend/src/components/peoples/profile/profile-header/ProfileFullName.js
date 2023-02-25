import React from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

export default function ProfileFullName({ name, surname, loading }) {
    return loading ? (
        <Skeleton animation='wave' height={25} width='60%' />
    ) : (
        <Stack direction='row' spacing={1}>
            <Typography variant='h6'>{name}</Typography>
            <Typography variant='h6'>{surname}</Typography>
        </Stack>
    );
}
