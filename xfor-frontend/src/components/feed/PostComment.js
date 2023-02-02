import React from 'react';

import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';

import PostCommentText from './PostCommentText';
import PostCommentAvatar from './PostCommentAvatar';
import PostCommentActions from './PostCommentActions';
import PostCommentReplies from './PostCommentReplies';

import { useSelector, useDispatch } from 'react-redux';
import { commentLike } from '../../store/actions/commentsActions';

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
    const { likePendingComments } = useSelector((state) => state.comments);

    const handleLikeClick = () => {
        dispatch(commentLike(id));
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
            <PostCommentReplies
                replies={replies}
                repliesCnt={repliesCnt}
                commentId={id}
            ></PostCommentReplies>
        </>
    );
}
