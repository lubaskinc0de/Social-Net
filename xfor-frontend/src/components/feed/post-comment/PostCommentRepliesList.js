import React from 'react';

import PostComment from './PostComment';

import { getTimeInfo } from '../../../lib/feed';

export default function PostCommentRepliesList({ replies }) {
    return replies.map((reply) => (
        <PostComment
            key={reply.id}
            id={reply.id}
            username={`${reply.author.first_name} ${reply.author.last_name}`}
            text={reply.body}
            timesince={getTimeInfo(reply.created_at).join(' в ')}
            likesCount={reply.like_cnt}
            avatarAlt={reply.author.first_name}
            avatarSrc={reply.author.avatar}
            isLiked={reply.is_user_liked_comment}
            replies={[]}
        ></PostComment>
    ));
}
