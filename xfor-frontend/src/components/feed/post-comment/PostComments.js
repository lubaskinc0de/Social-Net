import React, { useCallback } from 'react';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

import PostCommentsList from './PostCommentsList';
import AddPostComment from './add-comment/AddPostComment';

import FeedInfiniteScroll from '../FeedInfiniteScroll';

import { useSelector, useDispatch } from 'react-redux';
import { getCommentsWrapper } from '../../../store/actions/commentsActions';

import './comments.css';

export default function PostComments() {
    const { postComments } = useSelector((state) => state.comments);
    const { post } = useSelector((state) => state.posts);

    const dispatch = useDispatch();

    const fetchComments = useCallback(() => {
        dispatch(getCommentsWrapper(post.id));
    }, [dispatch, post]);

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
            }}
            maxWidth='xl'
        >
            <Paper
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    p: 1,
                }}
            >
                <AddPostComment></AddPostComment>
                <Divider variant='fullwidth' sx={{mx: -1, mt: 1}}></Divider>
                <PostCommentsList></PostCommentsList>
            </Paper>
            {!postComments.length ? null : (
                <FeedInfiniteScroll
                    onIntersecting={fetchComments}
                ></FeedInfiniteScroll>
            )}
        </Container>
    );
}
