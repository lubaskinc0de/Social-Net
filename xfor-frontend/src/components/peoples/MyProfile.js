import React from 'react';

import Profile from './profile/Profile';

import { useSelector } from 'react-redux';

export default function MyProfile() {
    const {
        first_name,
        last_name,
        bio,
        avatar,
        city,
        followers,
        age,
        dateJoined,
    } = useSelector((state) => state.user.userInfo);
    const { loading } = useSelector((state) => state.user);

    return (
        <Profile
            name={first_name}
            surname={last_name}
            bio={bio}
            src={avatar}
            loading={loading}
            city={city}
            followersCount={followers ? followers.length : 0}
            yearsOld={age}
            dateJoined={dateJoined}
        ></Profile>
    );
}
