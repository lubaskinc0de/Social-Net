import React from 'react';
import Grid from '@mui/material/Grid';
import PostCard from './card/PostCard';

export default function FeedSkeleton() {
    return Array.from(Array(3)).map((_, idx) => {
        return (
            <Grid
                item
                key={idx}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <PostCard loading></PostCard>
            </Grid>
        );
    });
}
