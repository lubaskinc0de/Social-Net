import React from 'react';

import List from '@mui/material/List';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import PostComment from './PostComment';

export default function PostComments({ title }) {
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
            <List
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    bgcolor: 'background.default',
                    mb: 2,
                }}
            >
                <Paper sx={{
                    p: 1,
                }} elevation={1}>
                    {[1, 2, 3].map((el) => (
                        <PostComment key={el}></PostComment>
                    ))}
                </Paper>
            </List>
        </Container>
    );
}
