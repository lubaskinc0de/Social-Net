import React from 'react';

import Box from '@mui/material/Box';

import { useSelector, useDispatch } from 'react-redux';

import { getCommentDescendantsWrapper } from '../../../store/actions/commentsActions';

import PostCommentRepliesSkeleton from './PostCommentRepliesSkeleton';
import PostCommentRepliesList from './PostCommentRepliesList';
import PostCommentShowMoreReplies from './PostCommentShowMoreReplies';

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
            <PostCommentRepliesList replies={replies}></PostCommentRepliesList>
            {descendantsLoading[commentId] ? (
                <PostCommentRepliesSkeleton></PostCommentRepliesSkeleton>
            ) : null}
            <PostCommentShowMoreReplies
                repliesCnt={repliesCnt}
                commentId={commentId}
                getDescendants={getDescendants}
            ></PostCommentShowMoreReplies>
            {descendantsPage[commentId] ? (
                <FeedInfiniteScroll
                    onIntersecting={getDescendants}
                ></FeedInfiniteScroll>
            ) : null}
        </Box>
    ) : null;
}
