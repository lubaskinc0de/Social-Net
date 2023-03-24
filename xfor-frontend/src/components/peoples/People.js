import React, { useEffect } from 'react';

import Profile from './profile/Profile';

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getPeople, getPeoplePosts } from '../../store/actions/peoplesActions';

export default function People() {
    const { profileId } = useParams();
    const dispatch = useDispatch();

    const {
        first_name,
        last_name,
        bio,
        avatar,
        city,
        followersCount,
        age,
        dateJoined,
    } = useSelector((state) => state.peoples.peopleInfo);
    const { loading } = useSelector((state) => state.peoples);

    const {
        posts,
        postsLoading,
        peopleInfo: { userId },
    } = useSelector((state) => state.peoples);

    useEffect(() => {
        dispatch(getPeople(profileId));
    }, [dispatch, profileId]);

    useEffect(() => {
        if (userId) {
            dispatch(getPeoplePosts());
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
            feedTitle='Стена'
        ></Profile>
    );
}
