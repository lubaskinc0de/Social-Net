import React from 'react';

import Stack from '@mui/material/Stack';

import ProfileAvatar from './ProfileAvatar';
import ProfileFullName from './ProfileFullName';
import ProfileBio from './ProfileBio';

import ProfileHeaderSkeleton from './ProfileHeaderSkeleton';

export default function ProfileHeader({
    src,
    alt,
    name,
    surname,
    bio,
    loading,
}) {
    return (
        <Stack
            direction='row'
            sx={{ width: '100%' }}
            alignItems='center'
            spacing={2}
        >
            {!loading ? (
                <>
                    <ProfileAvatar src={src} alt={alt}></ProfileAvatar>
                    <Stack spacing={0.2}>
                        <ProfileFullName
                            name={name}
                            surname={surname}
                        ></ProfileFullName>
                        <ProfileBio bio={bio}></ProfileBio>
                    </Stack>
                </>
            ) : (
                <ProfileHeaderSkeleton></ProfileHeaderSkeleton>
            )}
        </Stack>
    );
}
