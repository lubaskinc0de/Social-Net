import React from 'react';
import Grid from '@mui/material/Grid';
import PostCard from './card/PostCard';

export default function FeedSkeleton() {
    return (
        <Grid
            item
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <PostCard maxWidth={500} loading></PostCard>
        </Grid>
    );
}
