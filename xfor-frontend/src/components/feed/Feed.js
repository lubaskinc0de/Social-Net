import React, {useEffect, useCallback} from 'react';
import NavBar from '../navigation/NavBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import FeedCards from './FeedCards';
import FeedInfiniteScroll from './FeedInfiniteScroll';
import FeedErrors from './FeedErrors';
import {useDispatch, useSelector} from 'react-redux';
import {getPostsWrapper} from '../../store/actions/postsActions';

export default function Feed() {
    const pages = ['Профиль', 'О нас']; // заглушка

    const dispatch = useDispatch();
    const {rejected} = useSelector((state) => state.posts);

    const fetchPosts = useCallback(() => {
        console.log('called');
        dispatch(getPostsWrapper());
    }, [dispatch]);

    useEffect(() => {
        document.title = 'Лента || KWIK';
    }, []);

    return (
        <>
            <NavBar pages={pages}></NavBar>
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                component='main'
                maxWidth='xl'>
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
                    spacing={2}>
                    <FeedErrors></FeedErrors>
                    <FeedCards></FeedCards>
                    {rejected ? null : (
                        <FeedInfiniteScroll
                            onIntersecting={fetchPosts}></FeedInfiniteScroll>
                    )}
                </Grid>
            </Container>
        </>
    );
}
