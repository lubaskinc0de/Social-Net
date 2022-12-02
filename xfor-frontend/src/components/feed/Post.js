import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import PostCard from './card/PostCard';
import PostSkeleton from './PostSkeleton';

import FeedContainer from './FeedContainer';

import { useSelector, useDispatch } from 'react-redux';
import { getPost } from '../../store/actions/postsActions';
import { clearPost } from '../../store/slices/feed/postsSlice';
import { getTimeInfo } from '../../lib/feed';
import { useParams } from 'react-router-dom';

export default function Post() {
    const { postId } = useParams();
    const { post } = useSelector((state) => state.posts);
    const [timeInfo, setTimeInfo] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPost(postId));
    }, [postId, dispatch]);

    useEffect(() => {
        if (post) {
            setTimeInfo(getTimeInfo(post.created_at));
        }
    }, [post]);

    useEffect(() => () => {
        dispatch(clearPost());
    }, [dispatch]);

    return (
        <FeedContainer>
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
                        isLiked={post.is_user_liked_post}
                        images={post.images}
                    ></PostCard>
                </Grid>
            ) : (
                <PostSkeleton></PostSkeleton>
            )}
        </FeedContainer>
    );
}
