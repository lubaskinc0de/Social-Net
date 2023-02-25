import React, { useEffect, useState, useCallback } from 'react';

import Grid from '@mui/material/Grid';
import PostCard from '../card/PostCard';
import PostSkeleton from './PostSkeleton';
import PostComments from '../post-comment/PostComments';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getCommentsWrapper } from '../../../store/actions/commentsActions';
import { getTimeInfo } from '../../../lib/feed';

export default function Post() {
    const [timeInfo, setTimeInfo] = useState([]);

    const { post, postNotFound } = useSelector((state) => state.posts);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (postNotFound) {
            navigate('/not-found/');
        }
    }, [postNotFound, navigate]);

    const fetchComments = useCallback(() => {
        dispatch(getCommentsWrapper(post.id));
    }, [dispatch, post]);

    useEffect(() => {
        if (post) {
            setTimeInfo(getTimeInfo(post.created_at));
            fetchComments();
        }
    }, [post, dispatch, fetchComments]);

    return (
        <>
            {post && timeInfo.length ? (
                <Grid
                    item
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <PostCard
                        maxWidth={500}
                        id={post.id}
                        content={post.content}
                        avatarAlt={post.author.first_name}
                        avatarSrc={post.author.avatar}
                        title={post.title}
                        subheader={`${post.author.first_name} ${post.author.last_name}`}
                        timesince={timeInfo[0]}
                        time={timeInfo[1]}
                        viewsCount={post.viewers_count}
                        likesCount={post.liked_count}
                        commentsCount={post.comments_count}
                        isLiked={post.is_user_liked_post}
                        images={post.images}
                    ></PostCard>
                </Grid>
            ) : (
                <PostSkeleton></PostSkeleton>
            )}
            <PostComments title='Комментарии'></PostComments>
        </>
    );
}
