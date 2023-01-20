import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/feed';
import { parseAPIAxiosErrors } from '../../lib';
import { setAPIErrors } from '../slices/APIErrorsSlice';

export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user, posts: postsState } = getState();
            const {
                nextPage: page,
                postsFilters: { priority, ordering, category },
            } = postsState;

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

            const urlEncode = (name, value, condition) => {
                return `${condition ? `&${name}=${value}` : ''}`;
            };

            const urlParameters = `page=${page}${urlEncode(
                priority,
                'on',
                priority
            )}${urlEncode('ordering', ordering, ordering)}${urlEncode(
                'category',
                category,
                category
            )}`;

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
                })
            );

            return rejectWithValue();
        }
    }
);

export const getCategories = createAsyncThunk(
    'posts/getCategories',
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const response = await API.getCategories(config);
            const categories = response.data;

            return {
                categories,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue();
        }
    }
);

export const getPostsWrapper = createAsyncThunk(
    'posts/getPostsWrapper',
    async (arg, { dispatch, getState }) => {
        const { loading } = getState().posts;

        if (!loading) {
            dispatch(getPosts(arg));
        }
    }
);

export const postLike = createAsyncThunk(
    'posts/likePost',
    async (postId, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const response = await API.postLike({ post: postId }, config);
            const action = response.data.action;

            return {
                postId,
                action,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue({
                postId,
            });
        }
    }
);

export const getPost = createAsyncThunk(
    'posts/getPost',
    async (postId, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const response = await API.getPost(postId, config);
            const post = response.data;

            return {
                post,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue({
                status: err.response.status,
            });
        }
    }
);
