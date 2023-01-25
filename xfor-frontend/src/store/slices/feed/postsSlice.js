import { createSlice } from '@reduxjs/toolkit';
import {
    getPosts,
    postLike,
    getPost,
    getCategories,
} from '../../actions/postsActions';

const postsSlice = createSlice({
    name: 'postsSlice',
    initialState: {
        posts: [],
        nextPage: 1,
        loading: null,
        rejected: null,
        likePendingPosts: {},
        postsFilters: {
            priority: null,
            ordering: null,
            category: null,
        },
        post: null,
        postNotFound: null,
        categories: [],
    },

    reducers: {
        /**
         * Set postsFilters.priority
         * @param {Object} state
         * @param {Object} action
         */
        setPostsPriority(state, action) {
            const { priority } = action.payload;

            if (state.postsFilters.priority !== priority) {
                // refresh

                state.posts = [];
                state.nextPage = 1;
            }

            state.postsFilters.priority = priority;
        },

        /**
         * Set postsFilters.ordering
         * @param {Object} state
         * @param {Object} action
         */
        setPostsOrdering(state, action) {
            const { ordering } = action.payload;

            if (state.postsFilters.ordering !== ordering) {
                // refresh

                state.posts = [];
                state.nextPage = 1;
            }

            state.postsFilters.ordering = ordering;
        },

        /**
         * Set postsFilters.category
         * @param {Object} state
         * @param {Object} action
         */
        setPostsCategory(state, action) {
            const { category } = action.payload;

            if (state.postsFilters.category !== category) {
                // refresh

                state.posts = [];
                state.nextPage = 1;
            }

            state.postsFilters.category = category;
        },
    },

    extraReducers: {
        // getPosts
        [getPosts.pending](state) {
            state.post = null;
            state.loading = true;
            state.rejected = false;
        },

        [getPosts.fulfilled](state, action) {
            const { posts, nextPage } = action.payload;

            const page = nextPage
                ? parseInt(
                      nextPage
                          .split('?')
                          .find((el) => el.includes('page'))
                          .split('=')[1]
                  )
                : null;

            if (posts.length) {
                state.posts = state.posts.concat(posts);
            }
            state.nextPage = page;
            state.loading = false;
        },

        [getPosts.rejected](state) {
            state.loading = false;
            state.rejected = true;
        },

        [getCategories.fulfilled](state, action) {
            const { categories } = action.payload;

            state.categories = categories;
        },

        // postLike
        [postLike.pending](state, action) {
            const { arg: postId } = action.meta;
            state.likePendingPosts[postId] = null;
        },

        [postLike.fulfilled](state, action) {
            const { action: actionType, postId } = action.payload;

            const postInPosts = state.posts.find(({ id }) => postId === id);
            const post =
                state.post && state.post.id === postId
                    ? state.post
                    : postInPosts;

            const isAdd = actionType === 'add';

            delete state.likePendingPosts[postId];

            post.is_user_liked_post = isAdd;
            post.liked_count += isAdd ? 1 : -1;
        },

        [postLike.rejected](state, action) {
            const { id: postId } = action.payload;
            delete state.likePendingPosts[postId];
        },

        // getPost

        [getPost.pending](state) {
            state.post = null;
            state.postNotFound = null;
            state.postComments = null;
            state.loading = true;
        },

        [getPost.fulfilled](state, action) {
            const { post } = action.payload;

            state.post = post;
            state.loading = false;
        },

        [getPost.rejected](state, action) {
            const { status } = action.payload;

            state.loading = false;

            if (status === 404) {
                state.postNotFound = true;
            }
        },
    },
});

export const { setPostsPriority, setPostsOrdering, setPostsCategory } =
    postsSlice.actions;

export default postsSlice.reducer;
