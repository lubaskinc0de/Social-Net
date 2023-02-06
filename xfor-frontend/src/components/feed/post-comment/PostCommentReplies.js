import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { getTimeInfo } from '../../../lib/feed';

import { useSelector, useDispatch } from 'react-redux';

import { getCommentDescendantsWrapper } from '../../../store/actions/commentsActions';

import PostComment from './PostComment';
import PostCommentRepliesSkeleton from './PostCommentRepliesSkeleton';

import FeedInfiniteScroll from '../FeedInfiniteScroll';

export default function PostCommentReplies({ replies, repliesCnt, commentId }) {
    const dispatch = useDispatch();
    const { descendantsPage, descendantsLoading } = useSelector(
        (state) => state.comments
    );

    const getDescendants = () => {
        dispatch(getCommentDescendantsWrapper(commentId));
    };

    return replies.length ? (
        <Box sx={{ pl: 7 }} className='comment__replies'>
            {replies.map((reply) => (
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
            ))}
            {descendantsLoading[commentId] ? (
                <PostCommentRepliesSkeleton></PostCommentRepliesSkeleton>
            ) : null}
            {repliesCnt && !descendantsPage.hasOwnProperty(commentId) ? (
                <Box display='flex' justifyContent='center'>
                    <Button
                        onClick={getDescendants}
                        sx={{ mt: 2 }}
                        size='small'
                    >
                        Показать еще {repliesCnt} ответ(ов)
                    </Button>
                </Box>
            ) : null}
            {descendantsPage[commentId] ? (
                <FeedInfiniteScroll
                    onIntersecting={getDescendants}
                ></FeedInfiniteScroll>
            ) : null}
        </Box>
    ) : null;
}
