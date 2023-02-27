import React, { useEffect } from 'react';

import Profile from './profile/Profile';

import { useSelector, useDispatch } from 'react-redux';

import { getUserPosts } from '../../store/actions/userActions';

export default function MyProfile() {
    const {
        first_name,
        last_name,
        bio,
        avatar,
        city,
        followersCount,
        age,
        dateJoined,
    } = useSelector((state) => state.user.userInfo);
    const { loading } = useSelector((state) => state.user);

    const {
        posts,
        postsLoading,
        userInfo: { userId },
    } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userId) {
            dispatch(getUserPosts());
        }
    }, [dispatch, userId]);

    return (
        <Profile
            name={first_name}
            surname={last_name}
            bio={bio}
            src={avatar}
            loading={loading}
            city={city}
            followersCount={followersCount}
            yearsOld={age}
            dateJoined={dateJoined}
            posts={posts}
            postsLoading={!userId ? true : postsLoading}
        ></Profile>
    );
}
