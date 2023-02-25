import React from 'react';

import AppContainer from '../../utils/AppContainer';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import ProfileHeader from './profile-header/ProfileHeader';
import ProfileStats from './profile-stats/ProfileStats';

export default function Profile({
    alt,
    src,
    name,
    surname,
    bio,
    loading,
    followersCount,
    city,
    yearsOld,
    dateJoined,
}) {
    return (
        <AppContainer>
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                component='main'
                maxWidth='md'
            >
                <Paper sx={{ width: '100%', p: 2 }} elevation={3}>
                    <Stack spacing={2}>
                        <ProfileHeader
                            alt={alt}
                            src={src}
                            name={name}
                            surname={surname}
                            bio={bio}
                            loading={loading}
                        ></ProfileHeader>
                        <ProfileStats
                            followersCount={followersCount}
                            city={city}
                            yearsOld={yearsOld}
                            dateJoined={dateJoined}
                        ></ProfileStats>
                    </Stack>
                </Paper>
            </Container>
        </AppContainer>
    );
}
