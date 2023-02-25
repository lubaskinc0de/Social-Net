import React from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

export default function FeedPostsContainer({ children }) {
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            component='main'
            maxWidth='xl'
        >
            <Grid
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    mb: 3,
                }}
                direction='column'
                container
                spacing={2}
            >
                {children}
            </Grid>
        </Container>
    );
}
