import React from 'react';

import PostCommentSkeleton from './PostCommentSkeleton';

export default function PostCommentRepliesSkeleton() {
    return Array.from(Array(3)).map((_, idx) => {
        return (
            <div key={idx}>
                <PostCommentSkeleton></PostCommentSkeleton>
            </div>
        );
    });
}
