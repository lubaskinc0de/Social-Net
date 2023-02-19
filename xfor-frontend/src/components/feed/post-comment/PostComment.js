import React, { useState } from 'react';

import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';

import PostCommentText from './PostCommentText';
import PostCommentAvatar from './PostCommentAvatar';
import PostCommentActions from './PostCommentActions';
import PostCommentReplies from './PostCommentReplies';

import AddPostComment from './add-comment/AddPostComment';

import { useSelector, useDispatch } from 'react-redux';
import { commentLike } from '../../../store/actions/commentsActions';

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

    const [showAddCommentForm, setShowAddCommentForm] = useState(false);

    const handleLikeClick = () => {
        dispatch(commentLike(id));
    };

    const handleReplyClick = () => {
        setShowAddCommentForm(!showAddCommentForm);
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
                            handleReplyClick={handleReplyClick}
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
            <Collapse in={showAddCommentForm}>
                <Box sx={{ pl: 7, mt: 1 }}>
                    <AddPostComment
                        parent={id}
                        id={`reply-${id}`}
                    ></AddPostComment>
                </Box>
            </Collapse>
            <PostCommentReplies
                replies={replies}
                repliesCnt={repliesCnt}
                commentId={id}
            ></PostCommentReplies>
        </>
    );
}
