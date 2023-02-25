import React, { useEffect, useCallback } from 'react';

import FeedContainer from './FeedContainer';
import FeedPostsContainer from './FeedPostsContainer';

import FeedCards from './FeedCards';
import FeedInfiniteScroll from './FeedInfiniteScroll';

import { useDispatch, useSelector } from 'react-redux';
import { getPostsWrapper } from '../../store/actions/postsActions';

export default function Feed() {
    const dispatch = useDispatch();
    const { rejected, postsFilters, posts } = useSelector(
        (state) => state.posts
    );

    const fetchPosts = useCallback(() => {
        dispatch(getPostsWrapper());
    }, [dispatch]);

    useEffect(() => {
        document.title = 'Лента || KWIK';
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, postsFilters]);

    return (
        <>
            <FeedContainer>
                <FeedPostsContainer>
                    <FeedCards></FeedCards>
                </FeedPostsContainer>
                {rejected || !posts.length ? null : (
                    <FeedInfiniteScroll
                        onIntersecting={fetchPosts}
                    ></FeedInfiniteScroll>
                )}
            </FeedContainer>
        </>
    );
}
