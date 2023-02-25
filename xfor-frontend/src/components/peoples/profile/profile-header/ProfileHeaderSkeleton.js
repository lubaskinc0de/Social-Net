import React from 'react';

import Stack from '@mui/material/Stack';

import ProfileAvatar from './ProfileAvatar';
import ProfileFullName from './ProfileFullName';
import ProfileBio from './ProfileBio';

export default function ProfileHeaderSkeleton() {
    return (
        <>
            <ProfileAvatar loading></ProfileAvatar>
            <Stack sx={{ width: '100%' }} spacing={0.2}>
                <ProfileFullName loading></ProfileFullName>
                <ProfileBio loading></ProfileBio>
            </Stack>
        </>
    );
}
