import React from 'react';

import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

import PostCommentText from './PostCommentText';
import PostCommentAvatar from './PostCommentAvatar';

import PostCommentActions from './PostCommentActions';
import FeedInfiniteScroll from './FeedInfiniteScroll';

import { useSelector, useDispatch } from 'react-redux';
import {
    commentLike,
    getCommentDescendantsWrapper,
} from '../../store/actions/commentsActions';

import Box from '@mui/material/Box';

import { getTimeInfo } from '../../lib/feed';

import PostCommentRepliesSkeleton from './PostCommentRepliesSkeleton';

export default function PostComment({
    id,
    username,
    text,
    timesince,
    likesCount,
    avatarAlt,
    avatarSrc,
    isLiked,
    replies,
    repliesCnt,
}) {
    const dispatch = useDispatch();
    const { likePendingComments, descendantsPage, descendantsLoading } =
        useSelector((state) => state.comments);

    const handleLikeClick = () => {
        dispatch(commentLike(id));
    };

    const getDescendants = () => {
        dispatch(getCommentDescendantsWrapper(id));
    };

    return (
        <>
            <ListItem component='div' alignItems='flex-start' sx={{ pb: 0 }}>
                <PostCommentAvatar
                    alt={avatarAlt}
                    src={avatarSrc}
                ></PostCommentAvatar>
                <PostCommentText
                    username={username}
                    text={text}
                    timesince={timesince}
                    likesCount={likesCount}
                    actions={
                        <PostCommentActions
                            timesince={timesince}
                            likesCount={likesCount}
                            handleLikeClick={handleLikeClick}
                            isLikeDisabled={likePendingComments.hasOwnProperty(
                                id
                            )}
                            isLiked={isLiked}
                        ></PostCommentActions>
                    }
                ></PostCommentText>
            </ListItem>
            <Divider
                sx={{ mr: 2 }}
                variant='inset'
                className='comment__divider'
            />
            {replies.length ? (
                <Box sx={{ pl: 7 }} className='comment__replies'>
                    {replies.map((reply) => (
                        <PostComment
                            key={reply.id}
                            id={reply.id}
                            username={`${reply.author.first_name} ${reply.author.last_name}`}
                            text={reply.body}
                            timesince={getTimeInfo(reply.created_at).join(
                                ' в '
                            )}
                            likesCount={reply.like_cnt}
                            avatarAlt={reply.author.first_name}
                            avatarSrc={reply.author.avatar}
                            isLiked={reply.is_user_liked_comment}
                            replies={[]}
                        ></PostComment>
                    ))}
                    {descendantsLoading[id] ? (
                        <PostCommentRepliesSkeleton></PostCommentRepliesSkeleton>
                    ) : null}
                    {repliesCnt && !descendantsPage.hasOwnProperty(id) ? (
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
                    {descendantsPage[id] ? (
                        <FeedInfiniteScroll
                            onIntersecting={getDescendants}
                        ></FeedInfiniteScroll>
                    ) : null}
                </Box>
            ) : null}
        </>
    );
}
