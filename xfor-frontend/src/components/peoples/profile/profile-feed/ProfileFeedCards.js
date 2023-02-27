import React from 'react';

import FeedSkeleton from '../../../feed/FeedSkeleton';
import FeedPosts from '../../../feed/FeedPosts';

export default function ProfileFeedCards({ posts, postsLoading }) {
    return postsLoading && !posts.length ? (
        <FeedSkeleton></FeedSkeleton>
    ) : (
        <>
            <FeedPosts posts={posts}></FeedPosts>
            {postsLoading ? <FeedSkeleton /> : null}
        </>
    );
}
