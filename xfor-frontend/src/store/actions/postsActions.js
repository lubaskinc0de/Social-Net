import {createAsyncThunk} from '@reduxjs/toolkit';
import API from '../../api/feed';
import {parseAPIAxiosErrors} from '../../lib';
import {setAPIErrors} from '../slices/authentication/APIErrorsSlice';

export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async (_, {rejectWithValue, dispatch, getState}) => {
        try {
            const {user, posts: postsState} = getState();
            const {nextPage: page} = postsState;

            if (!page) {
                return {
                    posts: [],
                    nextPage: null,
                };
            }

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const urlParameters = `page=${page}`;

            const response = await API.getPosts(urlParameters, config);
            const posts = response.data.results;
            const nextPage = response.data.next;

            return {
                posts,
                nextPage,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                }),
            );

            return rejectWithValue();
        }
    },
);

export const getPostsWrapper = createAsyncThunk(
    'posts/getPostsWrapper',
    async (arg, {dispatch, getState}) => {
        const {loading} = getState().posts;

        if (!loading) {
            dispatch(getPosts(arg));
        }
    },
);

export const postLike = createAsyncThunk(
    'posts/likePost',
    async (id, {rejectWithValue, dispatch, getState}) => {
        try {
            const {user} = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const response = await API.postLike({post: id}, config);
            const action = response.data.action;

            return {
                id,
                action,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                }),
            );

            return rejectWithValue({
                id,
            });
        }
    },
);
