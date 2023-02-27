import React from 'react';

import FeedPostsContainer from '../../../feed/FeedPostsContainer';
import ProfileFeedCards from './ProfileFeedCards';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function ProfileFeed({ posts, postsLoading }) {
    return (
        <Box width='100%' sx={{ mt: 4 }}>
            <Stack spacing={3}>
                <Box width='100%' textAlign='center'>
                    <Typography variant='h5'>Ваши посты</Typography>
                </Box>
                <FeedPostsContainer>
                    <ProfileFeedCards
                        posts={posts}
                        postsLoading={postsLoading}
                    ></ProfileFeedCards>
                </FeedPostsContainer>
            </Stack>
        </Box>
    );
}
