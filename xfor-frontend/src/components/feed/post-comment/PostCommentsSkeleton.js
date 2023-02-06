import React from 'react';

import PostCommentSkeleton from './PostCommentSkeleton';

export default function PostCommentsSkeleton() {
    return Array.from(Array(3)).map((_, idx) => {
        return (
            <li key={idx}>
                <PostCommentSkeleton></PostCommentSkeleton>
            </li>
        );
    });
}
