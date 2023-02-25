import React, { useEffect } from 'react';

import FeedContainer from '../FeedContainer';
import Post from './Post';

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getPost } from '../../../store/actions/postsActions';

export default function PostPage() {
    const dispatch = useDispatch();

    const { post, loading } = useSelector((state) => state.posts);
    const { postId } = useParams();

    useEffect(() => {
        dispatch(getPost(postId));
    }, [postId, dispatch]);

    return (
        <>
            <FeedContainer>
                {!post && !loading ? null : <Post></Post>}
            </FeedContainer>
        </>
    );
}
