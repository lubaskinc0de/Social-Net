import React from 'react';
import CardContent from '@mui/material/CardContent';
import CardHeader from './PostCardHeader';
import Skeleton from '@mui/material/Skeleton';

export default function PostCardSkeleton(props) {
    return (
        <>
            <CardHeader loading></CardHeader>
            <Skeleton
                sx={{height: 300}}
                animation='wave'
                variant='rectangular'
            />
            <CardContent>
                <Skeleton
                    animation='wave'
                    height={10}
                    style={{marginBottom: 6}}
                />
                <Skeleton animation='wave' height={10} width='80%' />
            </CardContent>
        </>
    );
}
