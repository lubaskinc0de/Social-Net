import React from 'react';

import { useSelector } from 'react-redux';

import FeedSkeleton from './FeedSkeleton';
import FeedPosts from './FeedPosts';

export default function FeedCards() {
    const { posts, loading } = useSelector((state) => state.posts);

    return loading && !posts.length ? (
        <FeedSkeleton></FeedSkeleton>
    ) : (
        <>
            <FeedPosts posts={posts}></FeedPosts>
            {loading ? <FeedSkeleton /> : null}
        </>
    );
}
