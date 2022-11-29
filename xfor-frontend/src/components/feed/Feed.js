import React, { useEffect, useCallback } from 'react';
import NavBar from '../navigation/NavBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import FeedCards from './FeedCards';
import FeedInfiniteScroll from './FeedInfiniteScroll';
import FeedErrors from './FeedErrors';
import { useDispatch, useSelector } from 'react-redux';
import { getPostsWrapper } from '../../store/actions/postsActions';

export default function Feed() {
    const dispatch = useDispatch();
    const { rejected, postsFilters, posts } = useSelector(
        (state) => state.posts
    );

    const fetchPosts = useCallback(() => {
        dispatch(getPostsWrapper());
    }, [dispatch]);

    useEffect(() => {
        document.title = 'Лента || KWIK';
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, postsFilters]);

    return (
        <>
            <NavBar></NavBar>
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                component='main'
                maxWidth='xl'
            >
                <Grid
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        pt: 12,
                        mb: 3,
                    }}
                    direction='column'
                    container
                    spacing={2}
                >
                    <FeedErrors></FeedErrors>
                    <FeedCards></FeedCards>
                    {rejected || !posts.length ? null : (
                        <FeedInfiniteScroll
                            onIntersecting={fetchPosts}
                        ></FeedInfiniteScroll>
                    )}
                </Grid>
            </Container>
        </>
    );
}
