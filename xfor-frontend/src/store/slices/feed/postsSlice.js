import { createSlice } from '@reduxjs/toolkit';
import { getPosts, postLike, getPost } from '../../actions/postsActions';

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
        },
        post: null,
        postNotFound: null,
    },

    reducers: {
        setPostsPriority(state, action) {
            const { priority } = action.payload;

            if (state.postsFilters.priority !== priority) {
                // refresh

                state.posts = [];
                state.nextPage = 1;
            }

            state.postsFilters.priority = priority;
        },

        setPostsOrdering(state, action) {
            const { ordering } = action.payload;

            if (state.postsFilters.ordering !== ordering) {
                // refresh

                state.posts = [];
                state.nextPage = 1;
            }

            state.postsFilters.ordering = ordering;
        },

        clearRejected(state) {
            state.rejected = null;
        },

        clearPost(state) {
            state.post = null;
        },

        clearPostNotFound(state) {
            state.postNotFound = null;
        },
    },

    extraReducers: {
        // getPosts
        [getPosts.pending](state) {
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

        // postLike
        [postLike.pending](state, action) {
            const { arg: postId } = action.meta;
            state.likePendingPosts[postId] = null;
        },

        [postLike.fulfilled](state, action) {
            const { action: actionType, postId } = action.payload;

            const post =
                state.post && state.post.id === postId
                    ? state.post
                    : state.posts.find(({ id }) => postId === id);

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

export const { setPostsPriority, setPostsOrdering, clearRejected, clearPost, clearPostNotFound } =
    postsSlice.actions;

export default postsSlice.reducer;
